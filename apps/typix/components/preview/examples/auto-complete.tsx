"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { AutocompleteExtension } from "@typix-editor/extension-auto-complete";
import { ExamplePreview } from "../example-preview";

const content = `<p>Start typing on a new line to see ghost-text suggestions appear inline. Press <strong>Tab</strong> or <strong>→</strong> to accept a suggestion, or keep typing to ignore it.</p>`;

export default function AutoCompleteExample() {
  return (
    <ExamplePreview
      namespace="example-auto-complete"
      extensions={[StarterKit(), AutocompleteExtension()]}
      content={content}
      placeholder="Start typing — inline ghost suggestions appear. Press → or Tab to accept."
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
import { AutocompleteExtension } from "@typix-editor/extension-auto-complete";

const extensions = [StarterKit(), AutocompleteExtension()];

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
];
