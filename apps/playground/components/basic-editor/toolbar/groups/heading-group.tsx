"use client";

import { Heading1, Heading2, Heading3 } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function HeadingGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("h1")}
        title="Heading 1 (Ctrl+Alt+1)"
      >
        <Heading1 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("h2")}
        title="Heading 2 (Ctrl+Alt+2)"
      >
        <Heading2 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("h3")}
        title="Heading 3 (Ctrl+Alt+3)"
      >
        <Heading3 className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
