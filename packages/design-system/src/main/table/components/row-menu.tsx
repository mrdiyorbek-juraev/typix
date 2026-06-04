"use client";

import { $createParagraphNode, $parseSerializedNode } from "@typix-editor/core";
import type { TypixEditor } from "@typix-editor/core";
import {
  TableCellNode,
  TableCellHeaderStates,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $insertTableRowAtSelection,
  $deleteTableRowAtSelection,
  $getTableNodeFromLexicalNodeOrThrow,
  $isTableCellNode,
} from "@typix-editor/extension-table";
import {
  Trash2,
  Copy,
  Eraser,
  Rows3,
  AlignLeft,
  GripVertical,
  Palette,
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

export function RowMenu({
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
  const isHeaderRow = (headerState & TableCellHeaderStates.ROW) !== 0;
  const run = (fn: (cell: TableCellNode) => void) => withCell(cellKey, fn);

  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-4 cursor-grab items-center justify-center rounded border border-border/60 bg-background/90 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
          onMouseDown={(e) => e.preventDefault()}
          title="Row actions · Drag to reorder"
        >
          <GripVertical className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-48">
        <DropdownMenuLabel>Row</DropdownMenuLabel>

        <DropdownMenuItem
          onSelect={() => run(() => editor.chain().toggleHeaderRow().run())}
        >
          <AlignLeft />
          {isHeaderRow ? "Remove header" : "Header row"}
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
                  const row = $getTableRowNodeFromTableCellNodeOrThrow(cell);
                  for (const c of row.getChildren().filter($isTableCellNode)) {
                    c.setBackgroundColor(color);
                  }
                })
              }
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => run(() => $insertTableRowAtSelection(false))}
        >
          <Rows3 />
          Insert above
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => run(() => $insertTableRowAtSelection(true))}
        >
          <Rows3 />
          Insert below
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            run((cell) => {
              const row = $getTableRowNodeFromTableCellNodeOrThrow(cell);
              row.insertAfter($parseSerializedNode(row.exportJSON()));
            })
          }
        >
          <Copy />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            run((cell) => {
              const row = $getTableRowNodeFromTableCellNodeOrThrow(cell);
              for (const c of row.getChildren().filter($isTableCellNode)) {
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
          onSelect={() => run(() => $deleteTableRowAtSelection())}
        >
          <Trash2 />
          Delete row
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
