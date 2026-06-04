"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

import { useCurrentTypixEditor } from "@typix-editor/react";
import {
  TableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $getTableColumnIndexFromTableCellNode,
  $getTableRowIndexFromTableCellNode,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $isTableCellNode,
  $isTableRowNode,
  $isTableSelection,
} from "@typix-editor/extension-table";
import { Plus } from "lucide-react";
import type { TableHoverInfo } from "../types";
import { findTableElement } from "../utils";
import { useMounted, useTablePositions } from "../hooks";
import { CellMiniMenu } from "./cell-menu";
import { ColumnMenu } from "./column-menu";
import { RowMenu } from "./row-menu";
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getSelection,
} from "@typix-editor/core";

export function TableUI() {
  // useCurrentTypixEditor (vs useTypixEditorState): identity-stable editor
  // without subscribing to every update — TableUI only re-renders on its own
  // hover/selection state, not on every keystroke.
  const { editor } = useCurrentTypixEditor();
  const mounted = useMounted();
  const [hoverInfo, setHoverInfo] = useState<TableHoverInfo | null>(null);
  const [hasTableSelection, setHasTableSelection] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevent leave timer while any dropdown is open or during drag
  const menuOpenRef = useRef(false);
  const isDraggingRef = useRef(false);
  // Tracks whether the cursor is currently inside any portal handle (the
  // floating + strip, cell/row/col handles, etc). Mouse moves between the
  // editor root and a portal element can fire onMouseLeave(editor) and
  // onMouseEnter(portal) in an order where clearLeaveTimer runs before
  // startLeaveTimer, leaving a stray timer that nulls hoverInfo while the
  // cursor sits on the + button. The timer callback re-checks this ref to
  // skip nulling when the cursor is genuinely still on a handle.
  const cursorOnPortalRef = useRef(false);
  const dragIndicatorRef = useRef<HTMLDivElement>(null);
  // Tracks the in-flight drag's AbortController so we can tear down its
  // document-level pointermove/pointerup listeners on unmount — otherwise
  // unmounting mid-drag leaks listeners that fire against a dead closure.
  const dragControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      dragControllerRef.current?.abort();
      dragControllerRef.current = null;
    };
  }, []);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const startLeaveTimer = useCallback(() => {
    if (menuOpenRef.current || isDraggingRef.current) return;
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      // Re-check at fire time: the cursor may have entered a portal
      // handle (e.g. the + strip) after the timer was scheduled.
      if (
        menuOpenRef.current ||
        isDraggingRef.current ||
        cursorOnPortalRef.current
      ) {
        return;
      }
      setHoverInfo(null);
    }, 400);
  }, [clearLeaveTimer]);

  /** Run fn in a Lexical update, selecting the given cell first. */
  const withCell = useCallback(
    (cellKey: string, fn: (cell: TableCellNode) => void) => {
      if (!editor) return;
      editor.lexical.update(() => {
        const node = $getNodeByKey(cellKey);
        if (!(node instanceof TableCellNode)) return;
        node.selectEnd();
        fn(node);
      });
    },
    [editor]
  );

  // ── Track table selection state ──────────────────────────────────────────────

  useEffect(() => {
    if (!editor) return;
    let prev = false;
    return editor.lexical.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const next = $isTableSelection($getSelection());
        if (next !== prev) {
          prev = next;
          setHasTableSelection(next);
        }
      });
    });
  }, [editor]);

  // ── Mouse tracking ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!editor) return;
    const root = editor.lexical.getRootElement();
    if (!root) return;

    const handleMouseOver = (e: MouseEvent) => {
      if (isDraggingRef.current) return;
      // Freeze hover updates while a dropdown is open — otherwise the
      // trigger button (and the rest of the floating handles) chase the
      // mouse to a new cell while Radix keeps the dropdown open against
      // the old anchor, making it look like the menu spontaneously opened
      // on whatever cell the user is now hovering.
      if (menuOpenRef.current) return;
      clearLeaveTimer();
      const target = e.target as HTMLElement;
      const cellEl = target.closest("td, th") as HTMLElement | null;

      if (!cellEl) {
        startLeaveTimer();
        return;
      }

      let info: TableHoverInfo | null = null;

      editor.lexical.read(() => {
        const lexNode = $getNearestNodeFromDOMNode(cellEl);
        if (!(lexNode instanceof TableCellNode)) return;

        try {
          const rowNode = $getTableRowNodeFromTableCellNodeOrThrow(lexNode);
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(lexNode);
          const rowIndex = $getTableRowIndexFromTableCellNode(lexNode);
          const colIndex = $getTableColumnIndexFromTableCellNode(lexNode);
          const rowCount = tableNode.getChildrenSize();
          const colCount = rowNode.getChildrenSize();

          const rowEl = cellEl.closest("tr") as HTMLElement | null;
          const tableEl = cellEl.closest("table") as HTMLElement | null;
          if (!rowEl || !tableEl) return;

          info = {
            cellKey: lexNode.getKey(),
            rowIndex,
            colIndex,
            colSpan: lexNode.getColSpan(),
            rowSpan: lexNode.getRowSpan(),
            headerState: lexNode.getHeaderStyles(),
            rowCount,
            colCount,
            cellRect: cellEl.getBoundingClientRect(),
            rowRect: rowEl.getBoundingClientRect(),
            tableRect: tableEl.getBoundingClientRect(),
            verticalAlign: lexNode.getVerticalAlign() ?? "",
            rowStriping: tableNode.getRowStriping(),
            frozenRows: tableNode.getFrozenRows(),
            frozenColumns: tableNode.getFrozenColumns(),
          };
        } catch {
          // Not inside a table
        }
      });

      if (info) {
        // Skip re-render when the user hovers within the same cell — the
        // rects do drift slightly but a mouseover into a new cell will refresh
        // them, and within-cell mousemoves were spamming React reconciliation.
        const next: TableHoverInfo = info;
        setHoverInfo((prev: TableHoverInfo | null) =>
          prev &&
          prev.cellKey === next.cellKey &&
          prev.headerState === next.headerState &&
          prev.colSpan === next.colSpan &&
          prev.rowSpan === next.rowSpan
            ? prev
            : next
        );
      }
    };

    const handleMouseLeave = () => startLeaveTimer();

    root.addEventListener("mouseover", handleMouseOver);
    root.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      root.removeEventListener("mouseover", handleMouseOver);
      root.removeEventListener("mouseleave", handleMouseLeave);
      clearLeaveTimer();
    };
  }, [editor, clearLeaveTimer, startLeaveTimer]);

  // Note: row-striping / frozen-row / frozen-col / vertical-align were
  // previously implemented by injecting !important CSS keyed off data-*
  // attributes. That was a duplicate of behavior Lexical already provides
  // natively via TableNode.{setRowStriping,setFrozenRows,setFrozenColumns}
  // and TableCellNode.setVerticalAlign — those survive reconciliation,
  // serialize through exportJSON, and undo/redo correctly. The matching
  // CSS classes (typix-table--row-striping, typix-table--frozen-row,
  // typix-table--frozen-column) live in packages/design-system/src/styles/
  // editor.css and are emitted by Lexical via theme.tableRowStriping etc.

  const portalHandlers = useMemo(
    () => ({
      onMouseEnter: () => {
        cursorOnPortalRef.current = true;
        clearLeaveTimer();
      },
      onMouseLeave: () => {
        cursorOnPortalRef.current = false;
        startLeaveTimer();
      },
    }),
    [clearLeaveTimer, startLeaveTimer]
  );

  const handleMenuOpenChange = useCallback((open: boolean) => {
    menuOpenRef.current = open;
  }, []);

  // ── Drag-to-reorder columns/rows ──────────────────────────────────────────

  const showDragInd = useCallback(
    (type: "column" | "row", x: number, y: number, size: number) => {
      const el = dragIndicatorRef.current;
      if (!el) return;
      el.style.display = "block";
      if (type === "row") {
        el.style.left = `${x}px`;
        el.style.top = `${y - 1}px`;
        el.style.width = `${size}px`;
        el.style.height = "2px";
      } else {
        el.style.left = `${x - 1}px`;
        el.style.top = `${y}px`;
        el.style.width = "2px";
        el.style.height = `${size}px`;
      }
    },
    []
  );

  const hideDragInd = useCallback(() => {
    const el = dragIndicatorRef.current;
    if (el) el.style.display = "none";
  }, []);

  const handleGripDrag = useCallback(
    (
      type: "column" | "row",
      sourceIndex: number,
      cellKey: string,
      e: React.PointerEvent
    ) => {
      if (!editor) return;
      const startPos = type === "column" ? e.clientX : e.clientY;
      let dragging = false;
      let targetGap = sourceIndex;

      // Robust table element lookup — getElementByKey on the TableNode itself
      const tbl = findTableElement(editor, cellKey);
      if (!tbl) return;

      const onMove = (ev: PointerEvent) => {
        const currentPos = type === "column" ? ev.clientX : ev.clientY;

        if (!dragging && Math.abs(currentPos - startPos) > 5) {
          dragging = true;
          isDraggingRef.current = true;
        }
        if (!dragging) return;

        const tableRect = tbl.getBoundingClientRect();

        if (type === "row") {
          const rows = Array.from(tbl.rows);
          for (let i = 0; i < rows.length; i++) {
            const rect = rows[i]!.getBoundingClientRect();
            if (ev.clientY < rect.top + rect.height / 2) {
              targetGap = i;
              showDragInd("row", tableRect.left, rect.top, tableRect.width);
              return;
            }
          }
          const lastRect = rows[rows.length - 1]!.getBoundingClientRect();
          targetGap = rows.length;
          showDragInd("row", tableRect.left, lastRect.bottom, tableRect.width);
        } else {
          const firstRow = tbl.rows[0];
          if (!firstRow) return;
          const cells = Array.from(firstRow.cells);

          for (let i = 0; i < cells.length; i++) {
            const rect = cells[i]!.getBoundingClientRect();
            if (ev.clientX < rect.left + rect.width / 2) {
              targetGap = i;
              showDragInd("column", rect.left, tableRect.top, tableRect.height);
              return;
            }
          }
          const lastRect = cells[cells.length - 1]!.getBoundingClientRect();
          targetGap = cells.length;
          showDragInd(
            "column",
            lastRect.right,
            tableRect.top,
            tableRect.height
          );
        }
      };

      const onUp = () => {
        controller.abort();
        if (dragControllerRef.current === controller) {
          dragControllerRef.current = null;
        }
        hideDragInd();
        isDraggingRef.current = false;

        if (!dragging) return;

        // Prevent click from opening the dropdown after drag
        document.addEventListener(
          "click",
          (evt) => {
            evt.stopPropagation();
            evt.preventDefault();
          },
          { capture: true, once: true }
        );

        // No-op if dropping in same position
        if (targetGap === sourceIndex || targetGap === sourceIndex + 1) return;

        editor.lexical.update(() => {
          const node = $getNodeByKey(cellKey);
          if (!(node instanceof TableCellNode)) return;
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(node);

          if (type === "row") {
            const rows = tableNode.getChildren().filter($isTableRowNode);
            if (sourceIndex >= rows.length) return;
            const sourceRow = rows[sourceIndex]!;
            if (targetGap > sourceIndex) {
              rows[targetGap - 1]?.insertAfter(sourceRow);
            } else {
              rows[targetGap]?.insertBefore(sourceRow);
            }
          } else {
            const rows = tableNode.getChildren().filter($isTableRowNode);
            for (const row of rows) {
              const cells = row.getChildren().filter($isTableCellNode);
              if (sourceIndex >= cells.length) continue;
              const sourceCell = cells[sourceIndex]!;
              if (targetGap > sourceIndex) {
                if (targetGap - 1 < cells.length) {
                  cells[targetGap - 1]?.insertAfter(sourceCell);
                }
              } else {
                cells[targetGap]?.insertBefore(sourceCell);
              }
            }
          }
        });
      };

      // Abort any prior drag that somehow leaked (defensive) — should be no-op.
      dragControllerRef.current?.abort();
      const controller = new AbortController();
      dragControllerRef.current = controller;

      // Use capture phase to ensure events reach us even if Radix captures
      // the pointer. AbortController.signal removes both listeners in one
      // call when the drag ends or the component unmounts.
      document.addEventListener("pointermove", onMove, {
        capture: true,
        signal: controller.signal,
      });
      document.addEventListener("pointerup", onUp, {
        capture: true,
        signal: controller.signal,
      });
    },
    [editor, showDragInd, hideDragInd]
  );

  const positions = useTablePositions(hoverInfo);

  if (!editor || !mounted || !hoverInfo || !positions) return null;

  return createPortal(
    <>
      {/* ── Column action handle (on top border) ─────────────────────────── */}
      <div
        className="fixed z-50"
        style={positions.colHandle}
        onPointerDown={(e) =>
          handleGripDrag("column", hoverInfo.colIndex, hoverInfo.cellKey, e)
        }
        {...portalHandlers}
      >
        <ColumnMenu
          hoverInfo={hoverInfo}
          withCell={withCell}
          editor={editor}
          onOpenChange={handleMenuOpenChange}
        />
      </div>

      {/* ── Row action handle (on left border) ───────────────────────────── */}
      <div
        className="fixed z-50"
        style={positions.rowHandle}
        onPointerDown={(e) =>
          handleGripDrag("row", hoverInfo.rowIndex, hoverInfo.cellKey, e)
        }
        {...portalHandlers}
      >
        <RowMenu
          hoverInfo={hoverInfo}
          withCell={withCell}
          editor={editor}
          onOpenChange={handleMenuOpenChange}
        />
      </div>

      {/* ── Cell mini-menu (inside cell, top-right) ───────────────────────── */}
      <div
        className="fixed z-50"
        style={positions.cellMenu}
        {...portalHandlers}
      >
        <CellMiniMenu
          hoverInfo={hoverInfo}
          withCell={withCell}
          editor={editor}
          hasTableSelection={hasTableSelection}
          onOpenChange={handleMenuOpenChange}
        />
      </div>

      {/* ── Add column + (full table height, right side) ─────────────── */}
      {positions.isLastCol && (
        <div
          className="fixed z-50"
          style={positions.addColStrip}
          {...portalHandlers}
        >
          <button
            title="Add column"
            className="flex h-full w-5 cursor-pointer items-center justify-center rounded border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              withCell(hoverInfo.cellKey, () =>
                $insertTableColumnAtSelection(true)
              )
            }
          >
            <Plus className="size-3" />
          </button>
        </div>
      )}

      {/* ── Add row + (full table width, bottom side) ─────────────────── */}
      {positions.isLastRow && (
        <div
          className="fixed z-50"
          style={positions.addRowStrip}
          {...portalHandlers}
        >
          <button
            title="Add row"
            className="flex h-5 w-full cursor-pointer items-center justify-center rounded border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              withCell(hoverInfo.cellKey, () =>
                $insertTableRowAtSelection(true)
              )
            }
          >
            <Plus className="size-3" />
          </button>
        </div>
      )}

      {/* ── Drag reorder indicator ──────────────────────────────────────── */}
      <div
        ref={dragIndicatorRef}
        style={{
          display: "none",
          position: "fixed",
          zIndex: 61,
          pointerEvents: "none",
          backgroundColor: "hsl(var(--primary))",
          boxShadow: "0 0 6px 1px hsl(var(--primary) / 0.4)",
        }}
      />
    </>,
    document.body
  );
}
