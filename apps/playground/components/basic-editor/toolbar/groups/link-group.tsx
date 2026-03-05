"use client";

import { Link, Unlink } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function LinkGroup() {
  const editor = useTypixEditorState();

  function handleSetLink() {
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().setLink({ url }).run();
  }

  return (
    <>
      <ToolbarButton onClick={handleSetLink} title="Insert Link (Ctrl+K)">
        <Link className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        title="Remove Link"
      >
        <Unlink className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
