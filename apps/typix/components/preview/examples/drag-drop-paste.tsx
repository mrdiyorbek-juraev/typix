"use client";

import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { DragDropPasteExtension } from "@typix-editor/extension-drag-drop-paste";
import { ImageExtension } from "@typix-editor/extension-image";
import { imageRenderer } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content = `<p>Drop an image file anywhere in this editor, or paste one from your clipboard. The image is inserted at the cursor position and uploaded via the configured handler.</p>`;

export default function DragDropPasteExample() {
  return (
    <ExamplePreview
      namespace="example-drag-drop-paste"
      extensions={[
        StarterKit({ dragDropPaste: false }),
        DragDropPasteExtension(),
        configExtension(ImageExtension, { component: imageRenderer }),
      ]}
      content={content}
      placeholder="Drop an image file or paste an image from your clipboard."
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
import { DragDropPasteExtension } from "@typix-editor/extension-drag-drop-paste";

const extensions = [StarterKit(), DragDropPasteExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Drop or paste an image..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
