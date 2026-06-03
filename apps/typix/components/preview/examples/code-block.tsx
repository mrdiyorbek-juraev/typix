"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { CodeBlockUI } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

export default function CodeBlockExample() {
  return (
    <ExamplePreview
      namespace="example-code-block"
      extensions={[StarterKit(), CodeBlockExtension]}
      placeholder="Insert a code block via the toolbar. Pick a language from the dropdown."
      overlays={<CodeBlockUI />}
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
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { CodeBlockUI } from "@/components/typix/main/code-block";

const extensions = [StarterKit(), CodeBlockExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Insert a code block..." />
      <CodeBlockUI />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
