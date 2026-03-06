"use client";

import { memo } from "react";
import { $getSelection } from "lexical";
import { $createParagraphNode } from "@typix-editor/react";
import type { TypixEditor } from "@typix-editor/react";
import {
  TableCellNode,
  TableCellHeaderStates,
  $getTableNodeFromLexicalNodeOrThrow,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  $isTableCellNode,
  $isTableSelection,
  $mergeCells,
  $unmergeCell,
} from "@typix-editor/extension-table";
import {
  Trash2,
  Columns3,
  Rows3,
  AlignLeft,
  Palette,
  TableCellsMerge,
  TableCellsSplit,
  Lock,
  AlignVerticalSpaceAround,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableHoverInfo } from "./types";
import { ColorPicker } from "./color-picker";

export const CellMiniMenu = memo(function CellMiniMenu({
  hoverInfo,
  withCell,
  editor,
  hasTableSelection,
  onOpenChange,
}: {
  hoverInfo: TableHoverInfo;
  withCell: (key: string, fn: (cell: TableCellNode) => void) => void;
  editor: TypixEditor;
  hasTableSelection: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { cellKey, colSpan, rowSpan, headerState } = hoverInfo;
  const isMerged = colSpan > 1 || rowSpan > 1;
  const isHeaderRow = (headerState & TableCellHeaderStates.ROW) !== 0;
  const isHeaderCol = (headerState & TableCellHeaderStates.COLUMN) !== 0;

  // Read DOM state for table-level toggles
  const cellDOM = editor.lexical.getElementByKey(cellKey);
  const tableEl = cellDOM?.closest("table") as HTMLElement | null;
  const currentVAlign = cellDOM?.getAttribute("data-valign") || "top";
  const isStriped = tableEl?.getAttribute("data-striped") === "true";
  const isRowFrozen = tableEl?.getAttribute("data-freeze-row") === "true";
  const isColFrozen = tableEl?.getAttribute("data-freeze-col") === "true";

  const toggleTableAttr = (attr: string) => {
    if (!tableEl) return;
    tableEl.setAttribute(
      attr,
      tableEl.getAttribute(attr) === "true" ? "false" : "true"
    );
  };

  const setVAlign = (align: string) => {
    if (cellDOM) cellDOM.setAttribute("data-valign", align);
  };

  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-[18px] items-center justify-center rounded border border-border/60 bg-background/90 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
          onMouseDown={(e) => e.preventDefault()}
          title="Cell options"
        >
          <ChevronDown className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-52">
        {/* Merge / Unmerge */}
        {hasTableSelection && (
          <DropdownMenuItem
            onSelect={() => {
              editor.lexical.update(() => {
                const selection = $getSelection();
                if (!$isTableSelection(selection)) return;
                const cells = selection.getNodes().filter($isTableCellNode);
                if (cells.length > 1) $mergeCells(cells);
              });
            }}
          >
            <TableCellsMerge className="size-4" />
            Merge cells
          </DropdownMenuItem>
        )}
        {isMerged && (
          <DropdownMenuItem
            onSelect={() => withCell(cellKey, () => $unmergeCell())}
          >
            <TableCellsSplit className="size-4" />
            Unmerge cells
          </DropdownMenuItem>
        )}
        {(hasTableSelection || isMerged) && <DropdownMenuSeparator />}

        {/* Background color */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="size-4" />
            Background color
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-2">
            <ColorPicker
              onSelect={(color) =>
                withCell(cellKey, (cell) => cell.setBackgroundColor(color))
              }
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Toggle row striping */}
        <DropdownMenuItem onSelect={() => toggleTableAttr("data-striped")}>
          <Rows3 className="size-4" />
          {isStriped ? "Remove row striping" : "Toggle row striping"}
        </DropdownMenuItem>

        {/* Vertical align */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <AlignVerticalSpaceAround className="size-4" />
            Vertical align
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-36">
            {(["top", "middle", "bottom"] as const).map((align) => (
              <DropdownMenuItem key={align} onSelect={() => setVAlign(align)}>
                {currentVAlign === align && <Check className="size-3.5 mr-1" />}
                <span className={currentVAlign !== align ? "ml-[18px]" : ""}>
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Freeze toggles */}
        <DropdownMenuItem onSelect={() => toggleTableAttr("data-freeze-row")}>
          <Lock className="size-4" />
          {isRowFrozen ? "Unfreeze first row" : "Toggle first row freeze"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toggleTableAttr("data-freeze-col")}>
          <Lock className="size-4" />
          {isColFrozen ? "Unfreeze first column" : "Toggle first column freeze"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Insert rows */}
        <DropdownMenuItem
          onSelect={() =>
            withCell(cellKey, () => $insertTableRowAtSelection(false))
          }
        >
          <Rows3 className="size-4" />
          Insert row above
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            withCell(cellKey, () => $insertTableRowAtSelection(true))
          }
        >
          <Rows3 className="size-4" />
          Insert row below
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Insert columns */}
        <DropdownMenuItem
          onSelect={() =>
            withCell(cellKey, () => $insertTableColumnAtSelection(false))
          }
        >
          <Columns3 className="size-4" />
          Insert column left
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            withCell(cellKey, () => $insertTableColumnAtSelection(true))
          }
        >
          <Columns3 className="size-4" />
          Insert column right
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete actions */}
        <DropdownMenuItem
          variant="destructive"
          onSelect={() =>
            withCell(cellKey, () => $deleteTableColumnAtSelection())
          }
        >
          <Trash2 className="size-4" />
          Delete column
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => withCell(cellKey, () => $deleteTableRowAtSelection())}
        >
          <Trash2 className="size-4" />
          Delete row
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onSelect={() =>
            withCell(cellKey, (cell) => {
              $getTableNodeFromLexicalNodeOrThrow(cell).remove();
            })
          }
        >
          <Trash2 className="size-4" />
          Delete table
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Header toggles */}
        <DropdownMenuItem
          onSelect={() =>
            withCell(cellKey, () => editor.chain().toggleHeaderRow().run())
          }
        >
          <AlignLeft className="size-4" />
          {isHeaderRow ? "Remove row header" : "Add row header"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            withCell(cellKey, () => editor.chain().toggleHeaderColumn().run())
          }
        >
          <AlignLeft className="size-4" />
          {isHeaderCol ? "Remove column header" : "Add column header"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
