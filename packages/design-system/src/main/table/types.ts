export interface TableHoverInfo {
  cellKey: string;
  rowIndex: number;
  colIndex: number;
  colSpan: number;
  rowSpan: number;
  headerState: number;
  rowCount: number;
  colCount: number;
  cellRect: DOMRect;
  rowRect: DOMRect;
  tableRect: DOMRect;
  /** "" | "top" | "middle" | "bottom" — read from TableCellNode.getVerticalAlign() */
  verticalAlign: string;
  /** Table-level row striping flag — read from TableNode.getRowStriping() */
  rowStriping: boolean;
  /** Number of frozen rows at the top — 0 means none. */
  frozenRows: number;
  /** Number of frozen columns on the left — 0 means none. */
  frozenColumns: number;
}

export type ResizeDirection = "column" | "row";

export interface ResizeHandle {
  direction: ResizeDirection;
  left: number;
  top: number;
  width: number;
  height: number;
  cellEl: HTMLElement;
  cellKey: string;
}

export interface ResizeDragLine {
  direction: ResizeDirection;
  pos: number;
  start: number;
  end: number;
}
