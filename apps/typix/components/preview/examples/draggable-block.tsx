"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";
import { DraggableBlock } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content = `<h2>Reorder blocks by dragging</h2><p>Hover over any block to reveal the drag handle on its left side.</p><p>Click and hold the handle, then drag the block to a new position in the document.</p><blockquote>Blockquotes, headings, and list items can all be rearranged this way.</blockquote><p>Release to drop the block at its new position.</p>`;

export default function DraggableBlockExample() {
  return (
    <ExamplePreview
      namespace="example-draggable-block"
      extensions={[StarterKit(), DraggableBlockExtension()]}
      content={content}
      placeholder="Hover over a paragraph — a drag handle appears on the left. Drag to reorder."
      overlays={<DraggableBlock />}
    />
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `"use client";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";
import { DraggableBlock } from "@/components/typix/main/draggable-block";

const extensions = [StarterKit(), DraggableBlockExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type some blocks..." />
      <DraggableBlock />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
