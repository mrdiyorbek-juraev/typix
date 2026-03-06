"use client";

import { useState } from "react";
import { ChevronRight, Code, ImageIcon, Table } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ImageInsertPopover } from "../../image-plugin/image-insert-popover";

export function InsertGroup() {
  const editor = useTypixEditorState();
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);

  return (
    <>
      <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
        <PopoverTrigger asChild>
            <ImageIcon className="size-3.5" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <ImageInsertPopover onClose={() => setImagePopoverOpen(false)} />
        </PopoverContent>
      </Popover>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().insertCodeBlock().run()
        }
        title="Insert Code Block (Ctrl+Alt+`)"
      >
        <Code className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().insertCollapsible().run()}
        title="Insert Collapsible"
      >
        <ChevronRight className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, columns: 3 }).run()
        }
        title="Insert Table"
      >
        <Table className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
