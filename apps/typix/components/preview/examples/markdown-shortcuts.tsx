"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { MarkdownShortcutsExtension } from "@typix-editor/extension-markdown-shortcuts";
import { ExamplePreview } from "../example-preview";

const content = `<h2>Markdown Shortcuts</h2><p>This editor converts markdown syntax on the fly. Type <strong>## </strong> on a new line for a heading, <strong>&gt; </strong> for a blockquote, or <strong>- </strong> for a bullet list.</p><p>Inline: wrap text in <strong>**double stars**</strong> for bold, <em>*single stars*</em> for italic, or <s>~~tildes~~</s> for strikethrough. Surround with <code>\`backticks\`</code> for inline code.</p>`;

export default function MarkdownShortcutsExample() {
  return (
    <ExamplePreview
      namespace="example-markdown-shortcuts"
      extensions={[StarterKit(), MarkdownShortcutsExtension()]}
      content={content}
      placeholder='Try typing "## ", "> ", "- ", or `code` — watch the syntax convert as you go.'
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
import { MarkdownShortcutsExtension } from "@typix-editor/extension-markdown-shortcuts";

const extensions = [StarterKit(), MarkdownShortcutsExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder='Try "## " or "> "...' />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
