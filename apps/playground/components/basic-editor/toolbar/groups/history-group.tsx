"use client";

import { Redo, Undo } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function HistoryGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton onClick={() => editor.chain().undo().run()} title="Undo (Ctrl+Z)">
        <Undo className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().redo().run()} title="Redo (Ctrl+Shift+Z)">
        <Redo className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
