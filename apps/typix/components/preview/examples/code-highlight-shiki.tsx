"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { CodeHighlightShikiExtension } from "@typix-editor/extension-code-highlight-shiki";
import { ExamplePreview } from "../example-preview";

const content = `<p>Click the <strong>code block</strong> button in the toolbar to insert a code block. Select a language from the dropdown — Shiki renders accurate, theme-aware syntax highlighting.</p>`;

export default function CodeHighlightShikiExample() {
  return (
    <ExamplePreview
      namespace="example-code-highlight-shiki"
      extensions={[
        StarterKit(),
        CodeBlockExtension,
        CodeHighlightShikiExtension(),
      ]}
      content={content}
      placeholder="Use the code-block button or paste code. Syntax highlights via Shiki."
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
import { CodeHighlightShikiExtension } from "@typix-editor/extension-code-highlight-shiki";

const extensions = [
  StarterKit(),
  CodeBlockExtension,
  CodeHighlightShikiExtension(),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Insert a code block..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
