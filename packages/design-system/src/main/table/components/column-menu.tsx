"use client";

import { $parseSerializedNode } from "lexical";
import { $createParagraphNode } from "@typix-editor/core";
import type { TypixEditor } from "@typix-editor/core";
import {
  TableCellNode,
  TableCellHeaderStates,
  TableRowNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableColumnIndexFromTableCellNode,
  $insertTableColumnAtSelection,
  $deleteTableColumnAtSelection,
  $isTableCellNode,
  $isTableRowNode,
} from "@typix-editor/extension-table";
import {
  Trash2,
  Copy,
  Eraser,
  Columns3,
  AlignLeft,
  GripHorizontal,
  Palette,
  ArrowUpAZ,
  ArrowDownZA,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../primitives/dropdown-menu";
import type { TableHoverInfo } from "../types";
import { ColorPicker } from "./color-picker";

export function ColumnMenu({
  hoverInfo,
  withCell,
  editor,
  onOpenChange,
}: {
  hoverInfo: TableHoverInfo;
  withCell: (key: string, fn: (cell: TableCellNode) => void) => void;
  editor: TypixEditor;
  onOpenChange: (open: boolean) => void;
}) {
  const { cellKey, headerState } = hoverInfo;
  const isHeaderCol = (headerState & TableCellHeaderStates.COLUMN) !== 0;
  const run = (fn: (cell: TableCellNode) => void) => withCell(cellKey, fn);

  const sortColumn = (ascending: boolean) => {
    run((cell) => {
      const colIdx = $getTableColumnIndexFromTableCellNode(cell);
      const table = $getTableNodeFromLexicalNodeOrThrow(cell);
      const rows = table.getChildren().filter($isTableRowNode);

      // Separate header rows from data rows
      const headerRows: TableRowNode[] = [];
      const dataRows: TableRowNode[] = [];

      for (const row of rows) {
        const firstCell = row.getFirstChild();
        if (
          $isTableCellNode(firstCell) &&
          (firstCell.getHeaderStyles() & TableCellHeaderStates.ROW) !== 0
        ) {
          headerRows.push(row);
        } else {
          dataRows.push(row);
        }
      }

      if (dataRows.length <= 1) return;

      const sorted = [...dataRows].sort((a, b) => {
        const cellsA = a.getChildren().filter($isTableCellNode);
        const cellsB = b.getChildren().filter($isTableCellNode);
        const textA = cellsA[colIdx]?.getTextContent() ?? "";
        const textB = cellsB[colIdx]?.getTextContent() ?? "";
        return ascending
          ? textA.localeCompare(textB)
          : textB.localeCompare(textA);
      });

      // Remove all data rows, then re-insert in sorted order
      for (const row of dataRows) row.remove();

      let anchor: TableRowNode | null =
        headerRows.length > 0 ? headerRows[headerRows.length - 1]! : null;

      for (const row of sorted) {
        if (anchor) {
          anchor.insertAfter(row);
        } else {
          const first = table.getFirstChild();
          if (first) first.insertBefore(row);
          else table.append(row);
        }
        anchor = row;
      }
    });
  };

  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-4 cursor-grab items-center justify-center rounded border border-border/60 bg-background/90 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
          onMouseDown={(e) => e.preventDefault()}
          title="Column actions · Drag to reorder"
        >
          <GripHorizontal className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom" className="w-48">
        <DropdownMenuLabel>Column</DropdownMenuLabel>

        <DropdownMenuItem
          onSelect={() => run(() => editor.chain().toggleHeaderColumn().run())}
        >
          <AlignLeft />
          {isHeaderCol ? "Remove header" : "Header column"}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette />
            Color
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-2">
            <ColorPicker
              onSelect={(color) =>
                run((cell) => {
                  const colIdx = $getTableColumnIndexFromTableCellNode(cell);
                  const table = $getTableNodeFromLexicalNodeOrThrow(cell);
                  for (const row of table
                    .getChildren()
                    .filter($isTableRowNode)) {
                    const cells = row.getChildren().filter($isTableCellNode);
                    const c = cells[colIdx];
                    if (c) c.setBackgroundColor(color);
                  }
                })
              }
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => sortColumn(true)}>
          <ArrowUpAZ />
          Sort ascending
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => sortColumn(false)}>
          <ArrowDownZA />
          Sort descending
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => run(() => $insertTableColumnAtSelection(false))}
        >
          <Columns3 />
          Insert left
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => run(() => $insertTableColumnAtSelection(true))}
        >
          <Columns3 />
          Insert right
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            run((cell) => {
              const colIdx = $getTableColumnIndexFromTableCellNode(cell);
              const table = $getTableNodeFromLexicalNodeOrThrow(cell);
              for (const row of table.getChildren().filter($isTableRowNode)) {
                const cells = row.getChildren().filter($isTableCellNode);
                const src = cells[colIdx];
                if (!src) continue;
                src.insertAfter($parseSerializedNode(src.exportJSON()));
              }
            })
          }
        >
          <Copy />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            run((cell) => {
              const colIdx = $getTableColumnIndexFromTableCellNode(cell);
              const table = $getTableNodeFromLexicalNodeOrThrow(cell);
              for (const row of table.getChildren().filter($isTableRowNode)) {
                const cells = row.getChildren().filter($isTableCellNode);
                const c = cells[colIdx];
                if (!c) continue;
                c.clear();
                c.append($createParagraphNode());
              }
            })
          }
        >
          <Eraser />
          Clear contents
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
          onSelect={() => run(() => $deleteTableColumnAtSelection())}
        >
          <Trash2 />
          Delete column
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
          onSelect={() =>
            run((cell) => {
              $getTableNodeFromLexicalNodeOrThrow(cell).remove();
            })
          }
        >
          <Trash2 />
          Delete table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
