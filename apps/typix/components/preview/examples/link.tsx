"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { FloatingLinkUI } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content = `<p>Select <em>any text in this paragraph</em> and press <strong>⌘K</strong> (or Ctrl+K on Windows) to turn it into a link. You can also use the toolbar link button above.</p><p>Click an existing link to edit its URL or remove it entirely.</p>`;

export default function LinkExample() {
  return (
    <ExamplePreview
      namespace="example-link"
      extensions={[StarterKit(), FloatingLinkExtension]}
      content={content}
      placeholder="Select text and turn it into a link via the toolbar or keyboard."
      overlays={<FloatingLinkUI />}
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
import { LinkExtension } from "@typix-editor/extension-link";

const extensions = [StarterKit(), LinkExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Select to add a link..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
