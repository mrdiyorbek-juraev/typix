"use client";

import { Code2, Quote } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function BlockGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("quote")}
        title="Blockquote (Ctrl+Shift+Q)"
      >
        <Quote className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("code-block")}
        title="Code Block (Ctrl+Alt+`)"
      >
        <Code2 className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
