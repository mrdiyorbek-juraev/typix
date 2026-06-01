"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { FloatingLinkUI } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content = `<p>Select <strong>any text in this paragraph</strong> to reveal the floating toolbar. Click the link icon to attach a URL, then press Enter to confirm.</p><p>Click on any existing link to open the floating editor and edit or remove the URL.</p>`;

export default function FloatingLinkExample() {
  return (
    <ExamplePreview
      namespace="example-floating-link"
      extensions={[StarterKit(), FloatingLinkExtension]}
      content={content}
      placeholder="Select text and add a link — the floating editor pops over it."
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
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { FloatingLinkUI } from "@/components/typix/main/floating-link";

const extensions = [StarterKit(), FloatingLinkExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Select text and link it..." />
      <FloatingLinkUI />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
