"use client";

import { List, ListChecks, ListOrdered } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function ListGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bullet")}
        title="Bullet List"
      >
        <List className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("number")}
        title="Ordered List"
      >
        <ListOrdered className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCheckList().run()}
        active={editor.isActive("check")}
        title="Check List"
      >
        <ListChecks className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
