"use client";

import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function AlignmentGroup() {
  const editor = useTypixEditorState();
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().alignLeft().run()}
        title="Align Left (Ctrl+Shift+L)"
      >
        <AlignLeft className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().alignCenter().run()}
        title="Align Center (Ctrl+Shift+E)"
      >
        <AlignCenter className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().alignRight().run()}
        title="Align Right (Ctrl+Shift+R)"
      >
        <AlignRight className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().alignJustify().run()}
        title="Justify (Ctrl+Shift+J)"
      >
        <AlignJustify className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
