"use client";

import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { MaxLengthExtension } from "@typix-editor/extension-max-length";
import { ExamplePreview } from "../example-preview";

const MAX = 280;

const content = `<p>This editor silently blocks input once you reach ${MAX} characters. Unlike character-limit, there is no visible counter — new keystrokes are simply ignored once the cap is hit. Try it.</p>`;

export default function MaxLengthExample() {
  return (
    <ExamplePreview
      namespace="example-max-length"
      extensions={[
        StarterKit(),
        configExtension(MaxLengthExtension, { maxLength: MAX }),
      ]}
      content={content}
      placeholder={`Try typing more than ${MAX} characters — input gets blocked at the cap.`}
      toolbar="minimal"
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
import { MaxLengthExtension } from "@typix-editor/extension-max-length";

const extensions = [
  StarterKit(),
  configExtension(MaxLengthExtension, { maxLength: 280 }),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Up to 280 characters..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
