"use client";

import { Highlighter, Subscript, Superscript } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function TextExtrasGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive("subscript")}
        title="Subscript"
      >
        <Subscript className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive("superscript")}
        title="Superscript"
      >
        <Superscript className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
        title="Highlight"
      >
        <Highlighter className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
