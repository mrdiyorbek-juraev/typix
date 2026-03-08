"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  $getNodeByKey,
  $getNearestNodeFromDOMNode,
  $getSelection,
} from "lexical";
import { useTypixEditorState } from "@typix-editor/react";
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
import { useMounted } from "../hooks";
import { CellMiniMenu } from "./cell-menu";
import { ColumnMenu } from "./column-menu";
import { RowMenu } from "./row-menu";

export function TableUI() {
  const editor = useTypixEditorState();
  const mounted = useMounted();
  const [hoverInfo, setHoverInfo] = useState<TableHoverInfo | null>(null);
  const [hasTableSelection, setHasTableSelection] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevent leave timer while any dropdown is open or during drag
  const menuOpenRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragIndicatorRef = useRef<HTMLDivElement>(null);

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
      if (!menuOpenRef.current && !isDraggingRef.current) setHoverInfo(null);
    }, 400);
  }, [clearLeaveTimer]);

  /** Run fn in a Lexical update, selecting the given cell first. */
  const withCell = useCallback(
    (cellKey: string, fn: (cell: TableCellNode) => void) => {
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
    const root = editor.lexical.getRootElement();
    if (!root) return;

    const handleMouseOver = (e: MouseEvent) => {
      if (isDraggingRef.current) return;
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
          };
        } catch {
          // Not inside a table
        }
      });

      if (info) setHoverInfo(info);
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

  // ── Inject table-level CSS for striping, freeze, vertical-align ────────────

  useEffect(() => {
    const id = "typix-table-plugin-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      table[data-striped="true"] tr:nth-child(even) td,
      table[data-striped="true"] tr:nth-child(even) th {
        background-color: var(--typix-table-row-striping-bg) !important;
      }
      td[data-valign="top"], th[data-valign="top"] { vertical-align: top !important; }
      td[data-valign="middle"], th[data-valign="middle"] { vertical-align: middle !important; }
      td[data-valign="bottom"], th[data-valign="bottom"] { vertical-align: bottom !important; }
      table[data-freeze-row="true"] tr:first-child td,
      table[data-freeze-row="true"] tr:first-child th {
        position: sticky !important; top: 0; z-index: 1;
        background-color: var(--background, white);
      }
      table[data-freeze-col="true"] td:first-child,
      table[data-freeze-col="true"] th:first-child {
        position: sticky !important; left: 0; z-index: 1;
        background-color: var(--background, white);
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  const portalHandlers = useMemo(
    () => ({ onMouseEnter: clearLeaveTimer, onMouseLeave: startLeaveTimer }),
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
        document.removeEventListener("pointermove", onMove, true);
        document.removeEventListener("pointerup", onUp, true);
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

      // Use capture phase to ensure events reach us even if Radix captures the pointer
      document.addEventListener("pointermove", onMove, true);
      document.addEventListener("pointerup", onUp, true);
    },
    [editor, showDragInd, hideDragInd]
  );

  if (!mounted || !hoverInfo) return null;

  const { tableRect, rowRect, cellRect } = hoverInfo;

  // ── Positions ─────────────────────────────────────────────────────────────
  const COL_HANDLE_SIZE = 16;
  const ROW_HANDLE_SIZE = 16;

  const colHandleLeft = Math.round(
    cellRect.left + cellRect.width / 2 - COL_HANDLE_SIZE / 2
  );
  const colHandleTop = Math.round(tableRect.top - COL_HANDLE_SIZE / 2);

  const rowHandleLeft = Math.round(tableRect.left - ROW_HANDLE_SIZE / 2);
  const rowHandleTop = Math.round(
    rowRect.top + rowRect.height / 2 - ROW_HANDLE_SIZE / 2
  );

  const cellMenuLeft = Math.round(cellRect.right - 22);
  const cellMenuTop = Math.round(cellRect.top + 3);

  // Add-column strip: full table height, to the right of the table
  const addColLeft = Math.round(tableRect.right + 4);
  const addColTop = Math.round(tableRect.top);
  const addColHeight = Math.round(tableRect.height);

  // Add-row strip: full table width, below the table
  const addRowLeft = Math.round(tableRect.left);
  const addRowTop = Math.round(tableRect.bottom + 4);
  const addRowWidth = Math.round(tableRect.width);

  // Show + buttons only when hovering the last column / last row
  const isLastCol = Math.abs(cellRect.right - tableRect.right) < 5;
  const isLastRow = Math.abs(rowRect.bottom - tableRect.bottom) < 5;

  return createPortal(
    <>
      {/* ── Column action handle (on top border) ─────────────────────────── */}
      <div
        className="fixed z-50"
        style={{ left: colHandleLeft, top: colHandleTop }}
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
        style={{ left: rowHandleLeft, top: rowHandleTop }}
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
        style={{ left: cellMenuLeft, top: cellMenuTop }}
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
      {isLastCol && (
        <div
          className="fixed z-50"
          style={{ left: addColLeft, top: addColTop, height: addColHeight }}
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
      {isLastRow && (
        <div
          className="fixed z-50"
          style={{ left: addRowLeft, top: addRowTop, width: addRowWidth }}
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
          backgroundColor: "#151B54",
          boxShadow: "0 0 6px 1px hsl(var(--primary) / 0.4)",
        }}
      />
    </>,
    document.body
  );
}
