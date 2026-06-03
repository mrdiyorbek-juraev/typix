"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { ExamplePreview } from "../example-preview";

const content = `<h2>Welcome to Typix</h2><p>A <strong>headless</strong>, <em>framework-agnostic</em> rich text editor built on Lexical. Supports React, Vue, and Svelte adapters out of the box.</p><ul><li>Extension-based architecture</li><li>Full TypeScript support</li><li>Command-driven API</li></ul>`;

export default function QuickExample() {
  return (
    <ExamplePreview
      namespace="example-quick"
      extensions={[StarterKit()]}
      content={content}
      placeholder="Start typing..."
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

const extensions = [StarterKit()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Start typing..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
  {
    name: "package.json",
    lang: "json",
    code: `{
  "dependencies": {
    "@typix-editor/react": "^2.0.0",
    "@typix-editor/extension-starter-kit": "^2.0.0",
    "lexical": "^0.45.0",
    "@lexical/react": "^0.45.0"
  }
}`,
  },
];
