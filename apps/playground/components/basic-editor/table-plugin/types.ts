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
