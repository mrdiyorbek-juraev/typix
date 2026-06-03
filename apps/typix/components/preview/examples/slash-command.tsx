"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { SlashCommandExtension } from "@typix-editor/extension-slash-command";
import { SlashDropdownMenu } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

export default function SlashCommandExample() {
  return (
    <ExamplePreview
      namespace="example-slash-command"
      extensions={[StarterKit(), SlashCommandExtension]}
      placeholder="Type / anywhere to open the command menu — insert headings, lists, quotes."
      overlays={<SlashDropdownMenu />}
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
import { SlashCommandExtension } from "@typix-editor/extension-slash-command";
import { SlashDropdownMenu } from "@/components/typix/main/slash-command";

const extensions = [StarterKit(), SlashCommandExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type / for commands..." />
      <SlashDropdownMenu />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
