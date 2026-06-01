"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";
import { ExamplePreview } from "../example-preview";

const content = `<p>By default, Tab inside a rich-text editor inserts a tab character. This extension overrides that behaviour — <strong>Tab</strong> moves focus out of the editor, and <strong>Shift+Tab</strong> moves it back in.</p>`;

export default function TabFocusExample() {
  return (
    <ExamplePreview
      namespace="example-tab-focus"
      extensions={[StarterKit(), TabFocusExtension()]}
      content={content}
      placeholder="Press Tab to move focus OUT of the editor. Shift+Tab to move back in."
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
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";

const extensions = [StarterKit(), TabFocusExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Press Tab to exit..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
