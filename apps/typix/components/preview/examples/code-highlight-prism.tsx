"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";
import { ExamplePreview } from "../example-preview";

const content = `<p>Click the <strong>code block</strong> button in the toolbar to insert a code block. Select a language from the dropdown — Prism.js highlights the syntax in real time.</p>`;

export default function CodeHighlightPrismExample() {
  return (
    <ExamplePreview
      namespace="example-code-highlight-prism"
      extensions={[
        StarterKit(),
        CodeBlockExtension,
        CodeHighlightPrismExtension(),
      ]}
      content={content}
      placeholder="Use the code-block button or paste code. Syntax highlights via Prism.js."
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
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";

const extensions = [
  StarterKit(),
  CodeBlockExtension,
  CodeHighlightPrismExtension(),
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
