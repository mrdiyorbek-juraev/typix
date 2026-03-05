"use client";

import { ChevronRight } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function InsertGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().insertCollapsible().run()}
        title="Insert Collapsible"
      >
        <ChevronRight className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
