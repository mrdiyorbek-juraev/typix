"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { $getNodeByKey, $getNearestNodeFromDOMNode } from "lexical";
import { useTypixEditorState } from "@typix-editor/react";
import {
    TableCellNode,
    $getTableNodeFromLexicalNodeOrThrow,
    $getTableRowNodeFromTableCellNodeOrThrow,
    $getTableColumnIndexFromTableCellNode,
    $computeTableMapSkipCellCheck,
} from "@typix-editor/extension-table";
import type { ResizeHandle, ResizeDragLine, ResizeDirection } from "../types";
import { MIN_COL_WIDTH, MIN_ROW_HEIGHT, EDGE_ZONE } from "../constants";
import { getColumnDOMCells } from "../utils";
import { useMounted } from "../hooks";

export function TableCellResizer() {
    const editor = useTypixEditorState();
    const mounted = useMounted();
    const isDragging = useRef(false);

    // Use refs for DOM elements manipulated at 60fps during drag — avoids React re-renders
    const handleRef = useRef<HTMLDivElement>(null);
    const dragLineRef = useRef<HTMLDivElement>(null);

    // Cache the current handle info in a ref so the pointerdown handler always reads the latest
    const handleInfoRef = useRef<ResizeHandle | null>(null);

    const showHandle = useCallback((h: ResizeHandle | null) => {
        handleInfoRef.current = h;
        const el = handleRef.current;
        if (!el) return;
        if (!h) {
            el.style.display = "none";
            return;
        }
        el.style.display = "block";
        el.style.left = `${h.left}px`;
        el.style.top = `${h.top}px`;
        el.style.width = `${h.width}px`;
        el.style.height = `${h.height}px`;
        el.style.cursor = h.direction === "column" ? "col-resize" : "row-resize";
        el.style.borderRight =
            h.direction === "column" ? "2px solid hsl(var(--primary) / 0.7)" : "";
        el.style.borderBottom =
            h.direction === "row" ? "2px solid hsl(var(--primary) / 0.7)" : "";
    }, []);

    const showDragLine = useCallback((d: ResizeDragLine | null) => {
        const el = dragLineRef.current;
        if (!el) return;
        if (!d) {
            el.style.display = "none";
            return;
        }
        el.style.display = "block";
        if (d.direction === "column") {
            el.style.left = `${d.pos - 1}px`;
            el.style.top = `${d.start}px`;
            el.style.width = "2px";
            el.style.height = `${d.end - d.start}px`;
            el.style.boxShadow = "0 0 6px 1px hsl(var(--primary) / 0.4)";
        } else {
            el.style.left = `${d.start}px`;
            el.style.top = `${d.pos - 1}px`;
            el.style.width = `${d.end - d.start}px`;
            el.style.height = "2px";
            el.style.boxShadow = "0 6px 6px -3px hsl(var(--primary) / 0.4)";
        }
    }, []);

    // ── Detect hover near cell edges ─────────────────────────────────────────

    useEffect(() => {
        const root = editor.lexical.getRootElement();
        if (!root) return;

        // Track current hover cell to avoid redundant DOM reads
        let currentCellEl: HTMLElement | null = null;
        let currentDirection: ResizeDirection | null = null;

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging.current) return;

            const target = e.target as HTMLElement;
            const cellEl = target.closest("td, th") as HTMLElement | null;

            if (!cellEl) {
                if (currentCellEl) {
                    currentCellEl = null;
                    currentDirection = null;
                    showHandle(null);
                }
                return;
            }

            const rect = cellEl.getBoundingClientRect();
            const nearRight =
                e.clientX > rect.right - EDGE_ZONE && e.clientX <= rect.right + 2;
            const nearBottom =
                e.clientY > rect.bottom - EDGE_ZONE && e.clientY <= rect.bottom + 2;

            if (!nearRight && !nearBottom) {
                if (currentCellEl) {
                    currentCellEl = null;
                    currentDirection = null;
                    showHandle(null);
                }
                return;
            }

            const dir: ResizeDirection = nearRight ? "column" : "row";

            // Skip if same cell + same direction (no state change needed)
            if (cellEl === currentCellEl && dir === currentDirection) return;
            currentCellEl = cellEl;
            currentDirection = dir;

            let cellKey = "";
            editor.lexical.read(() => {
                const node = $getNearestNodeFromDOMNode(cellEl);
                if (node instanceof TableCellNode) cellKey = node.getKey();
            });
            if (!cellKey) return;

            if (dir === "column") {
                showHandle({
                    direction: "column",
                    left: rect.right - 2,
                    top: rect.top,
                    width: 4,
                    height: rect.height,
                    cellEl,
                    cellKey,
                });
            } else {
                showHandle({
                    direction: "row",
                    left: rect.left,
                    top: rect.bottom - 2,
                    width: rect.width,
                    height: 4,
                    cellEl,
                    cellKey,
                });
            }
        };

        root.addEventListener("mousemove", onMouseMove);
        return () => root.removeEventListener("mousemove", onMouseMove);
    }, [editor, showHandle]);

    // ── Start drag ───────────────────────────────────────────────────────────

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            const handle = handleInfoRef.current;
            if (!handle) return;
            e.preventDefault();
            isDragging.current = true;

            const { cellEl, cellKey, direction } = handle;
            const tableEl = cellEl.closest("table") as HTMLTableElement | null;
            const tableRect = tableEl?.getBoundingClientRect();

            if (direction === "column") {
                const startX = e.clientX;
                const startWidth = cellEl.getBoundingClientRect().width;

                let targetCol = 0;
                editor.lexical.read(() => {
                    const node = $getNodeByKey(cellKey);
                    if (node instanceof TableCellNode) {
                        targetCol = $getTableColumnIndexFromTableCellNode(node);
                    }
                });

                const colCells = getColumnDOMCells(tableEl, targetCol);

                const onMove = (ev: PointerEvent) => {
                    const dx = ev.clientX - startX;
                    const newWidth = Math.max(MIN_COL_WIDTH, startWidth + dx);

                    for (const el of colCells) {
                        el.style.width = `${newWidth}px`;
                        el.style.minWidth = `${newWidth}px`;
                        el.style.maxWidth = `${newWidth}px`;
                    }

                    const r = cellEl.getBoundingClientRect();
                    showHandle({
                        ...handle,
                        left: r.right - 2,
                        top: r.top,
                        height: r.height,
                    });

                    showDragLine({
                        direction: "column",
                        pos: ev.clientX,
                        start: tableRect?.top ?? r.top,
                        end: tableRect?.bottom ?? r.bottom,
                    });
                };

                const onUp = (ev: PointerEvent) => {
                    isDragging.current = false;
                    showDragLine(null);
                    document.removeEventListener("pointermove", onMove);
                    document.removeEventListener("pointerup", onUp);

                    const dx = ev.clientX - startX;
                    const newWidth = Math.max(MIN_COL_WIDTH, startWidth + dx);

                    for (const el of colCells) {
                        el.style.minWidth = "";
                        el.style.maxWidth = "";
                    }

                    editor.lexical.update(() => {
                        const node = $getNodeByKey(cellKey);
                        if (!(node instanceof TableCellNode)) return;

                        const tableNode = $getTableNodeFromLexicalNodeOrThrow(node);
                        const [tableMap] = $computeTableMapSkipCellCheck(
                            tableNode,
                            null,
                            null
                        );
                        const colIdx = $getTableColumnIndexFromTableCellNode(node);

                        const seen = new Set<string>();
                        for (let r = 0; r < tableMap.length; r++) {
                            const row = tableMap[r]!;
                            if (colIdx < row.length) {
                                const entry = row[colIdx];
                                if (entry) {
                                    const key = entry.cell.getKey();
                                    if (!seen.has(key)) {
                                        seen.add(key);
                                        entry.cell.setWidth(newWidth);
                                    }
                                }
                            }
                        }
                    });
                };

                document.addEventListener("pointermove", onMove);
                document.addEventListener("pointerup", onUp);
            } else {
                const startY = e.clientY;
                const rowEl = cellEl.closest("tr") as HTMLElement | null;
                const startHeight =
                    rowEl?.getBoundingClientRect().height ??
                    cellEl.getBoundingClientRect().height;

                const onMove = (ev: PointerEvent) => {
                    const dy = ev.clientY - startY;
                    const newHeight = Math.max(MIN_ROW_HEIGHT, startHeight + dy);

                    if (rowEl) rowEl.style.height = `${newHeight}px`;

                    const r = cellEl.getBoundingClientRect();
                    const bottomEl = rowEl ?? cellEl;
                    showHandle({
                        ...handle,
                        top: bottomEl.getBoundingClientRect().bottom - 2,
                        left: r.left,
                        width: r.width,
                    });

                    showDragLine({
                        direction: "row",
                        pos: ev.clientY,
                        start: tableRect?.left ?? r.left,
                        end: tableRect?.right ?? r.right,
                    });
                };

                const onUp = (ev: PointerEvent) => {
                    isDragging.current = false;
                    showDragLine(null);
                    document.removeEventListener("pointermove", onMove);
                    document.removeEventListener("pointerup", onUp);

                    if (rowEl) rowEl.style.height = "";

                    const dy = ev.clientY - startY;
                    const newHeight = Math.max(MIN_ROW_HEIGHT, startHeight + dy);

                    editor.lexical.update(() => {
                        const node = $getNodeByKey(cellKey);
                        if (!(node instanceof TableCellNode)) return;
                        const rowNode = $getTableRowNodeFromTableCellNodeOrThrow(node);
                        rowNode.setHeight(newHeight);
                    });
                };

                document.addEventListener("pointermove", onMove);
                document.addEventListener("pointerup", onUp);
            }
        },
        [editor, showHandle, showDragLine]
    );

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Hover handle — positioned via ref, no React state re-renders */}
            <div
                ref={handleRef}
                style={{
                    display: "none",
                    position: "fixed",
                    zIndex: 60,
                    backgroundColor: "hsl(var(--primary) / 0.3)",
                }}
                onPointerDown={handlePointerDown}
            />

            {/* Active drag line — positioned via ref */}
            <div
                ref={dragLineRef}
                style={{
                    display: "none",
                    position: "fixed",
                    zIndex: 61,
                    pointerEvents: "none" as const,
                    backgroundColor: "hsl(var(--primary))",
                }}
            />
        </>,
        document.body
    );
}
