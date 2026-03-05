"use client";

import { defaultTheme, EditorContent, EditorRoot } from "@typix-editor/react";
import { Toolbar } from "./toolbar";
import { editorExtensions } from "./extensions";

export default function BasicEditor() {
  return (
    <EditorRoot
      extensions={editorExtensions}
      namespace="typix-basic"
      theme={defaultTheme}
      onChange={() => {}}
      onContentChange={() => {}}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <Toolbar />
        <EditorContent
          className="min-h-[400px] p-4 text-sm focus:outline-none"
          placeholder="Start typing..."
        />
      </div>
    </EditorRoot>
  );
}
