import { useEffect, useMemo, useState } from "react";
import type { TableHoverInfo } from "./types";

/** SSR-safe mount guard — returns false on server and first render, true after hydration. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

const COL_HANDLE_SIZE = 16;
const ROW_HANDLE_SIZE = 16;
const EDGE_ALIGN_TOLERANCE = 5;

export interface TablePositions {
  colHandle: { left: number; top: number };
  rowHandle: { left: number; top: number };
  cellMenu: { left: number; top: number };
  addColStrip: { left: number; top: number; height: number };
  addRowStrip: { left: number; top: number; width: number };
  /** True when the hovered cell is in the last column — controls add-column +. */
  isLastCol: boolean;
  /** True when the hovered row is the last row — controls add-row +. */
  isLastRow: boolean;
}

/**
 * Derive every floating-handle coordinate from a TableHoverInfo. Pure
 * function of the rects — extracted into a hook so the render path stays
 * shallow and the math is unit-testable.
 *
 * Returns null when there is no hover info so callers can short-circuit
 * rendering without juggling conditional destructuring.
 */
export function useTablePositions(
  hoverInfo: TableHoverInfo | null
): TablePositions | null {
  return useMemo(() => {
    if (!hoverInfo) return null;
    const { tableRect, rowRect, cellRect } = hoverInfo;
    return {
      colHandle: {
        left: Math.round(
          cellRect.left + cellRect.width / 2 - COL_HANDLE_SIZE / 2
        ),
        top: Math.round(tableRect.top - COL_HANDLE_SIZE / 2),
      },
      rowHandle: {
        left: Math.round(tableRect.left - ROW_HANDLE_SIZE / 2),
        top: Math.round(rowRect.top + rowRect.height / 2 - ROW_HANDLE_SIZE / 2),
      },
      cellMenu: {
        left: Math.round(cellRect.right - 22),
        top: Math.round(cellRect.top + 3),
      },
      addColStrip: {
        left: Math.round(tableRect.right + 4),
        top: Math.round(tableRect.top),
        height: Math.round(tableRect.height),
      },
      addRowStrip: {
        left: Math.round(tableRect.left),
        top: Math.round(tableRect.bottom + 4),
        width: Math.round(tableRect.width),
      },
      isLastCol:
        Math.abs(cellRect.right - tableRect.right) < EDGE_ALIGN_TOLERANCE,
      isLastRow:
        Math.abs(rowRect.bottom - tableRect.bottom) < EDGE_ALIGN_TOLERANCE,
    };
  }, [hoverInfo]);
}
