import {
  configExtension,
  defineExtension,
  safeCast,
  $getSelection,
  $createParagraphNode,
  $parseSerializedNode,
  type LexicalEditor,
  type LexicalNode,
} from "lexical";
import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import {
  TableExtension as LexicalTableExtension,
  INSERT_TABLE_COMMAND,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  $unmergeCell,
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $getTableColumnIndexFromTableCellNode,
  TableCellHeaderStates,
  $isTableCellNode,
  $isTableRowNode,
  type InsertTableCommandPayloadHeaders,
} from "@typix-editor/core/lexical/table";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TableConfig extends TypixExtensionConfig {
  /** Temporarily disable all table behaviors and commands. */
  disabled: boolean;
  /**
   * Enable cell merging (colspan / rowspan).
   * When `false`, a transform enforces 1×1 cells on all tables.
   * Default: `true`
   */
  hasCellMerge: boolean;
  /**
   * Enable per-cell background colors.
   * When `false`, background colors are stripped from all cells.
   * Default: `true`
   */
  hasCellBackgroundColor: boolean;
  /**
   * Enable Tab key navigation between cells.
   * Default: `true`
   */
  hasTabHandler: boolean;
  /**
   * Wrap tables in a scrollable `<div>` to allow horizontal overflow.
   * Requires `theme.tableScrollableWrapper` to be set in the editor theme.
   * Default: `true`
   */
  hasHorizontalScroll: boolean;
  /**
   * Allow nested tables (experimental — not officially supported).
   * Default: `false`
   */
  hasNestedTables: boolean;
  /**
   * Attach CSS modifier classes to scrollable table wrappers so you can
   * add left/right shadow indicators via plain CSS:
   *
   * ```css
   * .typix-table-scrollable-wrapper--can-scroll-right { box-shadow: inset -8px 0 8px -6px rgba(0,0,0,.15); }
   * .typix-table-scrollable-wrapper--can-scroll-left  { box-shadow: inset  8px 0 8px -6px rgba(0,0,0,.15); }
   * ```
   *
   * Default: `true`
   */
  scrollShadow: boolean;
  /**
   * CSS class of the scrollable wrapper element produced by `TableNode`.
   * Must match `theme.tableScrollableWrapper` in your Lexical theme.
   * Default: `'typix-table-scrollable-wrapper'`
   */
  scrollableWrapperClass: string;
  /**
   * Default number of rows when inserting a table without explicit row count.
   * @default 3
   */
  defaultRows?: number;
  /**
   * Default number of columns when inserting a table without explicit column count.
   * @default 3
   */
  defaultColumns?: number;
}

// ─── Scroll shadow ───────────────────────────────────────────────────────────
// Adapted from the Lexical playground's TableScrollShadowPlugin.
// Rather than React, this runs entirely inside the Lexical register() callback
// so it works with any UI framework.

/** Inner implementation — `root` is guaranteed non-null by the caller. */
function _attachScrollShadow(root: HTMLElement, wrapperClass: string): () => void {
  const SCROLL_RIGHT_CLASS = `${wrapperClass}--can-scroll-right`;
  const SCROLL_LEFT_CLASS = `${wrapperClass}--can-scroll-left`;

  function updateScrollState(el: HTMLElement): void {
    const hasScroll = el.scrollWidth > el.clientWidth;
    // Adding ±1 for floating-point precision (mirrors the playground plugin)
    const canScrollRight =
      hasScroll && el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    const canScrollLeft = hasScroll && el.scrollLeft > 1;
    el.classList.toggle(SCROLL_RIGHT_CLASS, canScrollRight);
    el.classList.toggle(SCROLL_LEFT_CLASS, canScrollLeft);
  }

  function updateAll(): void {
    root
      .querySelectorAll<HTMLElement>(`.${wrapperClass}`)
      .forEach(updateScrollState);
  }

  const scrollHandlers = new Map<HTMLElement, () => void>();

  function addScrollListener(el: HTMLElement): void {
    if (scrollHandlers.has(el)) return;
    const handler = () => updateScrollState(el);
    el.addEventListener("scroll", handler, { passive: true });
    scrollHandlers.set(el, handler);
  }

  // Initialise all already-present wrappers
  updateAll();
  root.querySelectorAll<HTMLElement>(`.${wrapperClass}`).forEach(addScrollListener);

  const resizeObserver = new ResizeObserver(updateAll);

  // Watch for new wrappers being injected into the DOM
  const mutationObserver = new MutationObserver((mutations) => {
    updateAll();
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        const wrappers: HTMLElement[] = node.classList.contains(wrapperClass)
          ? [node]
          : [...node.querySelectorAll<HTMLElement>(`.${wrapperClass}`)];
        for (const el of wrappers) {
          resizeObserver.observe(el);
          addScrollListener(el);
          updateScrollState(el);
        }
      }
    }
  });

  mutationObserver.observe(root, { childList: true, subtree: true });

  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    scrollHandlers.forEach((handler, el) =>
      el.removeEventListener("scroll", handler)
    );
    scrollHandlers.clear();
  };
}

function setupScrollShadow(
  editor: LexicalEditor,
  wrapperClass: string
): () => void {
  const rootElement = editor.getRootElement();
  if (rootElement === null) return () => {};
  return _attachScrollShadow(rootElement, wrapperClass);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Clears all children from a cell and inserts an empty paragraph. */
function _clearCell(cellNode: import("@typix-editor/core/lexical/table").TableCellNode): void {
  cellNode.clear();
  cellNode.append($createParagraphNode());
}

// ─── Extension ──────────────────────────────────────────────────────────────

/**
 * TableExtension — full-featured table support for Typix.
 *
 * Registers `TableNode`, `TableRowNode`, `TableCellNode` and all built-in
 * table behaviors (selection, keyboard navigation, Insert/Delete commands,
 * cell merging, horizontal scroll) via `@lexical/table`'s `TableExtension`.
 *
 * Also attaches scroll-shadow CSS classes to scrollable table wrappers so
 * you can add left/right shadow indicators purely via CSS.
 *
 * ### Commands
 * | command                  | attrs                                               |
 * |--------------------------|-----------------------------------------------------|
 * | `insertTable`            | `{ rows?, columns?, includeHeaders? }`              |
 * | `insertRowAbove`         | —                                                   |
 * | `insertRowBelow`         | —                                                   |
 * | `insertColumnLeft`       | —                                                   |
 * | `insertColumnRight`      | —                                                   |
 * | `deleteRow`              | —                                                   |
 * | `deleteColumn`           | —                                                   |
 * | `deleteTable`            | —                                                   |
 * | `unmergeCells`           | —                                                   |
 * | `toggleHeaderRow`        | —                                                   |
 * | `toggleHeaderColumn`     | —                                                   |
 * | `clearCellContents`      | —                                                   |
 * | `clearRowContents`       | —                                                   |
 * | `clearColumnContents`    | —                                                   |
 * | `duplicateRow`           | —                                                   |
 * | `duplicateColumn`        | —                                                   |
 * | `setCellBackgroundColor` | `{ color: string \| null }`                         |
 * | `setRowBackgroundColor`  | `{ color: string \| null }`                         |
 * | `setColumnBackgroundColor`| `{ color: string \| null }`                        |
 *
 * @example
 * ```ts
 * // All defaults
 * extensions={[TableExtension()]}
 *
 * // Disable cell merging, no nested tables
 * extensions={[TableExtension({ hasCellMerge: false })]}
 *
 * // Insert a 4×5 table with headers
 * editor.chain().insertTable({ rows: 4, columns: 5, includeHeaders: true }).run()
 * ```
 */
export const TableExtension = (userConfig: Partial<TableConfig> = {}) => {
  const resolvedConfig: TableConfig = {
    disabled: false,
    hasCellMerge: true,
    hasCellBackgroundColor: true,
    hasTabHandler: true,
    hasHorizontalScroll: true,
    hasNestedTables: false,
    scrollShadow: true,
    scrollableWrapperClass: "typix-table-scrollable-wrapper",
    ...userConfig,
  };

  // Delegate all Lexical-level table setup (node registration, INSERT_TABLE_COMMAND
  // handler, cell-merge transforms, tab/arrow navigation) to @lexical/table's
  // own extension.  Only pass the five fields it understands.
  const configuredLexicalTable = configExtension(LexicalTableExtension, {
    hasCellMerge: resolvedConfig.hasCellMerge,
    hasCellBackgroundColor: resolvedConfig.hasCellBackgroundColor,
    hasTabHandler: resolvedConfig.hasTabHandler,
    hasHorizontalScroll: resolvedConfig.hasHorizontalScroll,
    hasNestedTables: resolvedConfig.hasNestedTables,
  });

  const lexicalExt = defineExtension({
    name: "@typix/table",

    // @lexical/table's TableExtension handles everything at the Lexical level.
    dependencies: [configuredLexicalTable],

    config: safeCast<TableConfig>(resolvedConfig),

    mergeConfig(a: TableConfig, b: Partial<TableConfig>): TableConfig {
      return { ...a, ...b };
    },

    build(_editor: LexicalEditor, config: TableConfig) {
      return namedSignals(config);
    },

    register(editor: LexicalEditor, _config: TableConfig, state: any) {
      const {
        disabled,
        scrollShadow,
        scrollableWrapperClass,
      } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;
        if (!scrollShadow.value) return;
        return setupScrollShadow(editor, scrollableWrapperClass.value);
      });
    },
  });

  return defineTypixExtension<TableConfig>({
    name: "table",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /**
       * Insert a new table at the current selection.
       * @param attrs `{ rows?: number, columns?: number, includeHeaders?: boolean | { rows: boolean; columns: boolean } }`
       */
      insertTable: (config) => (ctx, attrs) => {
        const rows = String(
          (attrs?.rows as number | string | undefined) ?? config.defaultRows ?? 3
        );
        const columns = String(
          (attrs?.columns as number | string | undefined) ?? config.defaultColumns ?? 3
        );
        const includeHeaders = (
          attrs?.includeHeaders !== undefined ? attrs.includeHeaders : true
        ) as InsertTableCommandPayloadHeaders;
        ctx.editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          rows,
          columns,
          includeHeaders,
        });
        return true;
      },

      /** Insert a row above the currently focused table cell. */
      insertRowAbove: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $insertTableRowAtSelection(false);
        });
        return true;
      },

      /** Insert a row below the currently focused table cell. */
      insertRowBelow: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $insertTableRowAtSelection(true);
        });
        return true;
      },

      /** Insert a column to the left of the currently focused table cell. */
      insertColumnLeft: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $insertTableColumnAtSelection(false);
        });
        return true;
      },

      /** Insert a column to the right of the currently focused table cell. */
      insertColumnRight: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $insertTableColumnAtSelection(true);
        });
        return true;
      },

      /** Delete the row containing the currently focused table cell. */
      deleteRow: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $deleteTableRowAtSelection();
        });
        return true;
      },

      /** Delete the column containing the currently focused table cell. */
      deleteColumn: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $deleteTableColumnAtSelection();
        });
        return true;
      },

      /**
       * Delete the entire table that contains the current selection.
       * No-ops if the selection is not inside a table.
       */
      deleteTable: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0];
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          $getTableNodeFromLexicalNodeOrThrow(cellNode).remove();
        });
        return true;
      },

      /**
       * Unmerge the currently focused merged table cell back into individual cells.
       * No-ops if the cell is not merged.
       */
      unmergeCells: (_config) => (ctx) => {
        ctx.editor.update(() => {
          $unmergeCell();
        });
        return true;
      },

      /**
       * Toggle header state for all cells in the table's first row.
       * If all cells already have the ROW header bit, it is removed; otherwise it is set.
       */
      toggleHeaderRow: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
          const firstRow = tableNode.getFirstChild();
          if (!$isTableRowNode(firstRow)) return;
          const cells = firstRow
            .getChildren()
            .filter($isTableCellNode);
          const isHeaderRow =
            cells.length > 0 &&
            cells.every((c) => c.hasHeaderState(TableCellHeaderStates.ROW));
          const newBit = isHeaderRow
            ? TableCellHeaderStates.NO_STATUS
            : TableCellHeaderStates.ROW;
          for (const cell of cells) {
            cell.setHeaderStyles(newBit, TableCellHeaderStates.ROW);
          }
        });
        return true;
      },

      /**
       * Toggle header state for all cells in the table's first column.
       * If all cells already have the COLUMN header bit, it is removed; otherwise it is set.
       */
      toggleHeaderColumn: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
          const firstColCells = tableNode
            .getChildren()
            .filter($isTableRowNode)
            .map((row) => row.getFirstChild())
            .filter($isTableCellNode);
          const isHeaderCol =
            firstColCells.length > 0 &&
            firstColCells.every((c) =>
              c.hasHeaderState(TableCellHeaderStates.COLUMN)
            );
          const newBit = isHeaderCol
            ? TableCellHeaderStates.NO_STATUS
            : TableCellHeaderStates.COLUMN;
          for (const cell of firstColCells) {
            cell.setHeaderStyles(newBit, TableCellHeaderStates.COLUMN);
          }
        });
        return true;
      },

      /** Clear all content from the currently focused table cell. */
      clearCellContents: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          _clearCell(cellNode);
        });
        return true;
      },

      /** Clear all content from every cell in the row of the focused cell. */
      clearRowContents: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const rowNode = $getTableRowNodeFromTableCellNodeOrThrow(cellNode);
          for (const cell of rowNode.getChildren().filter($isTableCellNode)) {
            _clearCell(cell);
          }
        });
        return true;
      },

      /** Clear all content from every cell in the column of the focused cell. */
      clearColumnContents: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const colIndex = $getTableColumnIndexFromTableCellNode(cellNode);
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
          for (const row of tableNode.getChildren().filter($isTableRowNode)) {
            const cells = row.getChildren().filter($isTableCellNode);
            const cell = cells[colIndex];
            if (cell) _clearCell(cell);
          }
        });
        return true;
      },

      /**
       * Duplicate the row containing the focused cell, inserting the clone
       * immediately below the original.
       */
      duplicateRow: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const rowNode = $getTableRowNodeFromTableCellNodeOrThrow(cellNode);
          const clone = $parseSerializedNode(rowNode.exportJSON());
          rowNode.insertAfter(clone);
        });
        return true;
      },

      /**
       * Duplicate the column containing the focused cell, inserting the clone
       * immediately to the right of the original.
       */
      duplicateColumn: (_config) => (ctx) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const colIndex = $getTableColumnIndexFromTableCellNode(cellNode);
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
          for (const row of tableNode.getChildren().filter($isTableRowNode)) {
            const cells = row.getChildren().filter($isTableCellNode);
            const sourceCell = cells[colIndex];
            if (!sourceCell) continue;
            const clone = $parseSerializedNode(sourceCell.exportJSON());
            sourceCell.insertAfter(clone);
          }
        });
        return true;
      },

      /**
       * Set the background color of the currently focused table cell.
       * @param attrs `{ color: string | null }` — pass `null` to clear
       */
      setCellBackgroundColor: (_config) => (ctx, attrs) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          cellNode.setBackgroundColor(
            (attrs?.color as string | null | undefined) ?? null
          );
        });
        return true;
      },

      /**
       * Set the background color of every cell in the row of the focused cell.
       * @param attrs `{ color: string | null }` — pass `null` to clear
       */
      setRowBackgroundColor: (_config) => (ctx, attrs) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const rowNode = $getTableRowNodeFromTableCellNodeOrThrow(cellNode);
          const color = (attrs?.color as string | null | undefined) ?? null;
          for (const cell of rowNode.getChildren().filter($isTableCellNode)) {
            cell.setBackgroundColor(color);
          }
        });
        return true;
      },

      /**
       * Set the background color of every cell in the column of the focused cell.
       * @param attrs `{ color: string | null }` — pass `null` to clear
       */
      setColumnBackgroundColor: (_config) => (ctx, attrs) => {
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          const nodes = selection.getNodes();
          const firstNode = nodes[0] as LexicalNode | undefined;
          if (!firstNode) return;
          const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
          if (!cellNode) return;
          const colIndex = $getTableColumnIndexFromTableCellNode(cellNode);
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
          const color = (attrs?.color as string | null | undefined) ?? null;
          for (const row of tableNode.getChildren().filter($isTableRowNode)) {
            const cells = row.getChildren().filter($isTableCellNode);
            const cell = cells[colIndex];
            if (cell) cell.setBackgroundColor(color);
          }
        });
        return true;
      },
    },
  });
};
