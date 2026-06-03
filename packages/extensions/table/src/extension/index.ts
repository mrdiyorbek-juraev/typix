import {
  configExtension,
  defineExtension,
  safeCast,
  $getSelection,
  $createParagraphNode,
  $parseSerializedNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
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
import { withTypixMeta } from "@typix-editor/core";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TableConfig {
  disabled: boolean;
  hasCellMerge: boolean;
  hasCellBackgroundColor: boolean;
  hasTabHandler: boolean;
  hasHorizontalScroll: boolean;
  hasNestedTables: boolean;
  scrollShadow: boolean;
  scrollableWrapperClass: string;
  defaultRows?: number;
  defaultColumns?: number;
}

// ─── Scroll shadow ───────────────────────────────────────────────────────────

function _attachScrollShadow(
  root: HTMLElement,
  wrapperClass: string
): () => void {
  const SCROLL_RIGHT_CLASS = `${wrapperClass}--can-scroll-right`;
  const SCROLL_LEFT_CLASS = `${wrapperClass}--can-scroll-left`;

  function updateScrollState(el: HTMLElement): void {
    const hasScroll = el.scrollWidth > el.clientWidth;
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

  updateAll();
  root
    .querySelectorAll<HTMLElement>(`.${wrapperClass}`)
    .forEach(addScrollListener);

  const resizeObserver = new ResizeObserver(updateAll);

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

function _clearCell(
  cellNode: import("@typix-editor/core/lexical/table").TableCellNode
): void {
  cellNode.clear();
  cellNode.append($createParagraphNode());
}

// ─── Commands ────────────────────────────────────────────────────────────────

export const TYPIX_INSERT_TABLE = createCommand<{
  rows?: number;
  columns?: number;
  includeHeaders?: InsertTableCommandPayloadHeaders;
} | void>("TYPIX_INSERT_TABLE");

export const TYPIX_INSERT_ROW_ABOVE = createCommand<void>(
  "TYPIX_INSERT_ROW_ABOVE"
);
export const TYPIX_INSERT_ROW_BELOW = createCommand<void>(
  "TYPIX_INSERT_ROW_BELOW"
);
export const TYPIX_INSERT_COLUMN_LEFT = createCommand<void>(
  "TYPIX_INSERT_COLUMN_LEFT"
);
export const TYPIX_INSERT_COLUMN_RIGHT = createCommand<void>(
  "TYPIX_INSERT_COLUMN_RIGHT"
);
export const TYPIX_DELETE_ROW = createCommand<void>("TYPIX_DELETE_ROW");
export const TYPIX_DELETE_COLUMN = createCommand<void>("TYPIX_DELETE_COLUMN");
export const TYPIX_DELETE_TABLE = createCommand<void>("TYPIX_DELETE_TABLE");
export const TYPIX_UNMERGE_CELLS = createCommand<void>("TYPIX_UNMERGE_CELLS");
export const TYPIX_TOGGLE_HEADER_ROW = createCommand<void>(
  "TYPIX_TOGGLE_HEADER_ROW"
);
export const TYPIX_TOGGLE_HEADER_COLUMN = createCommand<void>(
  "TYPIX_TOGGLE_HEADER_COLUMN"
);
export const TYPIX_CLEAR_CELL_CONTENTS = createCommand<void>(
  "TYPIX_CLEAR_CELL_CONTENTS"
);
export const TYPIX_CLEAR_ROW_CONTENTS = createCommand<void>(
  "TYPIX_CLEAR_ROW_CONTENTS"
);
export const TYPIX_CLEAR_COLUMN_CONTENTS = createCommand<void>(
  "TYPIX_CLEAR_COLUMN_CONTENTS"
);
export const TYPIX_DUPLICATE_ROW = createCommand<void>("TYPIX_DUPLICATE_ROW");
export const TYPIX_DUPLICATE_COLUMN = createCommand<void>(
  "TYPIX_DUPLICATE_COLUMN"
);
export const TYPIX_SET_CELL_BACKGROUND_COLOR = createCommand<{
  color: string | null;
}>("TYPIX_SET_CELL_BACKGROUND_COLOR");
export const TYPIX_SET_ROW_BACKGROUND_COLOR = createCommand<{
  color: string | null;
}>("TYPIX_SET_ROW_BACKGROUND_COLOR");
export const TYPIX_SET_COLUMN_BACKGROUND_COLOR = createCommand<{
  color: string | null;
}>("TYPIX_SET_COLUMN_BACKGROUND_COLOR");

// ─── Static Lexical Table dependency ─────────────────────────────────────────

const DEFAULT_LEXICAL_TABLE = configExtension(LexicalTableExtension, {
  hasCellMerge: true,
  hasCellBackgroundColor: true,
  hasTabHandler: true,
  hasHorizontalScroll: true,
  hasNestedTables: false,
});

// ─── Extension ──────────────────────────────────────────────────────────────

export const TableExtension = withTypixMeta(
  defineExtension({
    name: "@typix/table",

    dependencies: [DEFAULT_LEXICAL_TABLE],

    config: safeCast<TableConfig>({
      disabled: false,
      hasCellMerge: true,
      hasCellBackgroundColor: true,
      hasTabHandler: true,
      hasHorizontalScroll: true,
      hasNestedTables: false,
      scrollShadow: true,
      scrollableWrapperClass: "typix-table-scrollable-wrapper",
    }),

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
        defaultRows,
        defaultColumns,
      } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        const disposers: Array<() => void> = [];

        if (scrollShadow.value) {
          disposers.push(
            setupScrollShadow(editor, scrollableWrapperClass.value)
          );
        }

        disposers.push(
          editor.registerCommand(
            TYPIX_INSERT_TABLE,
            (payload) => {
              const rows = String(payload?.rows ?? defaultRows?.value ?? 3);
              const columns = String(
                payload?.columns ?? defaultColumns?.value ?? 3
              );
              const includeHeaders = (
                payload?.includeHeaders !== undefined
                  ? payload.includeHeaders
                  : true
              ) as InsertTableCommandPayloadHeaders;
              editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                rows,
                columns,
                includeHeaders,
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_INSERT_ROW_ABOVE,
            () => {
              editor.update(() => $insertTableRowAtSelection(false));
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_INSERT_ROW_BELOW,
            () => {
              editor.update(() => $insertTableRowAtSelection(true));
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_INSERT_COLUMN_LEFT,
            () => {
              editor.update(() => $insertTableColumnAtSelection(false));
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_INSERT_COLUMN_RIGHT,
            () => {
              editor.update(() => $insertTableColumnAtSelection(true));
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_DELETE_ROW,
            () => {
              editor.update(() => $deleteTableRowAtSelection());
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_DELETE_COLUMN,
            () => {
              editor.update(() => $deleteTableColumnAtSelection());
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_DELETE_TABLE,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                $getTableNodeFromLexicalNodeOrThrow(cellNode).remove();
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_UNMERGE_CELLS,
            () => {
              editor.update(() => $unmergeCell());
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_TOGGLE_HEADER_ROW,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
                const firstRow = tableNode.getFirstChild();
                if (!$isTableRowNode(firstRow)) return;
                const cells = firstRow.getChildren().filter($isTableCellNode);
                const isHeaderRow =
                  cells.length > 0 &&
                  cells.every((c) =>
                    c.hasHeaderState(TableCellHeaderStates.ROW)
                  );
                const newBit = isHeaderRow
                  ? TableCellHeaderStates.NO_STATUS
                  : TableCellHeaderStates.ROW;
                for (const cell of cells) {
                  cell.setHeaderStyles(newBit, TableCellHeaderStates.ROW);
                }
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_TOGGLE_HEADER_COLUMN,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
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
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_CLEAR_CELL_CONTENTS,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                _clearCell(cellNode);
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_CLEAR_ROW_CONTENTS,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const rowNode =
                  $getTableRowNodeFromTableCellNodeOrThrow(cellNode);
                for (const cell of rowNode
                  .getChildren()
                  .filter($isTableCellNode)) {
                  _clearCell(cell);
                }
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_CLEAR_COLUMN_CONTENTS,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const colIndex =
                  $getTableColumnIndexFromTableCellNode(cellNode);
                const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
                for (const row of tableNode
                  .getChildren()
                  .filter($isTableRowNode)) {
                  const cells = row.getChildren().filter($isTableCellNode);
                  const cell = cells[colIndex];
                  if (cell) _clearCell(cell);
                }
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_DUPLICATE_ROW,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const rowNode =
                  $getTableRowNodeFromTableCellNodeOrThrow(cellNode);
                const clone = $parseSerializedNode(rowNode.exportJSON());
                rowNode.insertAfter(clone);
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_DUPLICATE_COLUMN,
            () => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const colIndex =
                  $getTableColumnIndexFromTableCellNode(cellNode);
                const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
                for (const row of tableNode
                  .getChildren()
                  .filter($isTableRowNode)) {
                  const cells = row.getChildren().filter($isTableCellNode);
                  const sourceCell = cells[colIndex];
                  if (!sourceCell) continue;
                  const clone = $parseSerializedNode(sourceCell.exportJSON());
                  sourceCell.insertAfter(clone);
                }
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_SET_CELL_BACKGROUND_COLOR,
            ({ color }) => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                cellNode.setBackgroundColor(color);
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_SET_ROW_BACKGROUND_COLOR,
            ({ color }) => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const rowNode =
                  $getTableRowNodeFromTableCellNodeOrThrow(cellNode);
                for (const cell of rowNode
                  .getChildren()
                  .filter($isTableCellNode)) {
                  cell.setBackgroundColor(color);
                }
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          ),
          editor.registerCommand(
            TYPIX_SET_COLUMN_BACKGROUND_COLOR,
            ({ color }) => {
              editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;
                const firstNode = selection.getNodes()[0] as
                  | LexicalNode
                  | undefined;
                if (!firstNode) return;
                const cellNode = $getTableCellNodeFromLexicalNode(firstNode);
                if (!cellNode) return;
                const colIndex =
                  $getTableColumnIndexFromTableCellNode(cellNode);
                const tableNode = $getTableNodeFromLexicalNodeOrThrow(cellNode);
                for (const row of tableNode
                  .getChildren()
                  .filter($isTableRowNode)) {
                  const cells = row.getChildren().filter($isTableCellNode);
                  const cell = cells[colIndex];
                  if (cell) cell.setBackgroundColor(color);
                }
              });
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          )
        );

        return () => disposers.forEach((d) => d());
      });
    },
  }),
  {
    commands: () => ({
      insertTable:
        (attrs?: {
          rows?: number;
          columns?: number;
          includeHeaders?: InsertTableCommandPayloadHeaders;
        }) =>
        (editor: LexicalEditor) =>
          editor.dispatchCommand(TYPIX_INSERT_TABLE, attrs),
      insertRowAbove: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_INSERT_ROW_ABOVE, undefined),
      insertRowBelow: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_INSERT_ROW_BELOW, undefined),
      insertColumnLeft: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_INSERT_COLUMN_LEFT, undefined),
      insertColumnRight: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_INSERT_COLUMN_RIGHT, undefined),
      deleteRow: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_DELETE_ROW, undefined),
      deleteColumn: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_DELETE_COLUMN, undefined),
      deleteTable: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_DELETE_TABLE, undefined),
      unmergeCells: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_UNMERGE_CELLS, undefined),
      toggleHeaderRow: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_TOGGLE_HEADER_ROW, undefined),
      toggleHeaderColumn: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_TOGGLE_HEADER_COLUMN, undefined),
      clearCellContents: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_CLEAR_CELL_CONTENTS, undefined),
      clearRowContents: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_CLEAR_ROW_CONTENTS, undefined),
      clearColumnContents: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_CLEAR_COLUMN_CONTENTS, undefined),
      duplicateRow: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_DUPLICATE_ROW, undefined),
      duplicateColumn: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_DUPLICATE_COLUMN, undefined),
      setCellBackgroundColor:
        (attrs: { color: string | null }) => (editor: LexicalEditor) =>
          editor.dispatchCommand(TYPIX_SET_CELL_BACKGROUND_COLOR, attrs),
      setRowBackgroundColor:
        (attrs: { color: string | null }) => (editor: LexicalEditor) =>
          editor.dispatchCommand(TYPIX_SET_ROW_BACKGROUND_COLOR, attrs),
      setColumnBackgroundColor:
        (attrs: { color: string | null }) => (editor: LexicalEditor) =>
          editor.dispatchCommand(TYPIX_SET_COLUMN_BACKGROUND_COLOR, attrs),
    }),
  }
);

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    insertTable(attrs?: {
      rows?: number;
      columns?: number;
      includeHeaders?: any;
    }): R;
    insertRowAbove(): R;
    insertRowBelow(): R;
    insertColumnLeft(): R;
    insertColumnRight(): R;
    deleteRow(): R;
    deleteColumn(): R;
    deleteTable(): R;
    unmergeCells(): R;
    toggleHeaderRow(): R;
    toggleHeaderColumn(): R;
    clearCellContents(): R;
    clearRowContents(): R;
    clearColumnContents(): R;
    duplicateRow(): R;
    duplicateColumn(): R;
    setCellBackgroundColor(attrs: { color: string | null }): R;
    setRowBackgroundColor(attrs: { color: string | null }): R;
    setColumnBackgroundColor(attrs: { color: string | null }): R;
  }
}
