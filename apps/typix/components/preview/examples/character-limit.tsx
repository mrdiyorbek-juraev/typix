"use client";

import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CharacterLimitExtension } from "@typix-editor/extension-character-limit";
import { CharacterLimit } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const LIMIT = 280;

const content = `<p>This editor limits input to ${LIMIT} characters — great for tweets, comments, or bio fields. The counter below tracks your progress and turns red when you hit the cap.</p>`;

export default function CharacterLimitExample() {
  return (
    <ExamplePreview
      namespace="example-character-limit"
      extensions={[
        StarterKit(),
        configExtension(CharacterLimitExtension, { limit: LIMIT }),
      ]}
      content={content}
      placeholder={`Counter shows progress toward ${LIMIT} characters.`}
      toolbar="minimal"
      footer={<CharacterLimit maxLength={LIMIT} />}
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
import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CharacterLimitExtension } from "@typix-editor/extension-character-limit";
import { CharacterLimit } from "@/components/typix/main/character-limit";

const extensions = [
  StarterKit(),
  configExtension(CharacterLimitExtension, { limit: 280 }),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Write something..." />
      <CharacterLimit maxLength={280} />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
