"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { TailwindExtension } from "@typix-editor/extension-tailwind";
import { ExamplePreview } from "../example-preview";

export default function TailwindExample() {
  return (
    <ExamplePreview
      namespace="example-tailwind"
      extensions={[StarterKit(), TailwindExtension()]}
      placeholder="Editor nodes use Tailwind-friendly theme tokens out of the box."
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
import { TailwindExtension } from "@typix-editor/extension-tailwind";

const extensions = [StarterKit(), TailwindExtension()];

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
