import { $getNodeByKey } from "lexical";
import type { TypixEditor } from "@typix-editor/core";
import {
  TableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
} from "@typix-editor/extension-table";

/** Look up the HTMLTableElement from a cell node key. */
export function findTableElement(
  editor: TypixEditor,
  cellKey: string
): HTMLTableElement | null {
  let result: HTMLTableElement | null = null;
  editor.lexical.read(() => {
    const node = $getNodeByKey(cellKey);
    if (!(node instanceof TableCellNode)) return;
    const tableNode = $getTableNodeFromLexicalNodeOrThrow(node);
    const dom = editor.lexical.getElementByKey(tableNode.getKey());
    if (dom instanceof HTMLTableElement) {
      result = dom;
    } else if (dom) {
      result = dom.querySelector("table");
    }
  });
  return result;
}

/** Collect all DOM cells in a given logical column index from an HTML table. */
export function getColumnDOMCells(
  tableEl: HTMLTableElement | null,
  targetCol: number
): HTMLElement[] {
  if (!tableEl) return [];
  const cells: HTMLElement[] = [];
  for (const row of Array.from(tableEl.rows)) {
    let col = 0;
    for (const cell of Array.from(row.cells)) {
      const span = cell.colSpan || 1;
      if (col <= targetCol && targetCol < col + span) {
        cells.push(cell);
        break;
      }
      col += span;
    }
  }
  return cells;
}
