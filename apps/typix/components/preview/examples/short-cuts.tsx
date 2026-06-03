"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";
import { ExamplePreview } from "../example-preview";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform);

const mod = isMac ? "⌘" : "Ctrl+";
const alt = isMac ? "⌥" : "Alt+";
const shift = isMac ? "⇧" : "Shift+";

const content = `<h2>Keyboard Shortcuts</h2><p>Select any text and try: <strong>${mod}B</strong> for bold, <em>${mod}I</em> for italic, <u>${mod}U</u> for underline, or <s>${mod}${shift}X</s> for strikethrough.</p><p>Change block type: <strong>${mod}${alt}1</strong> through <strong>${mod}${alt}3</strong> for headings, <strong>${mod}${alt}C</strong> for a code block. Alignment: <strong>${mod}${shift}L</strong> left, <strong>${mod}${shift}E</strong> center, <strong>${mod}${shift}R</strong> right. Insert a link with <strong>${mod}K</strong>, or clear all formatting with <strong>${mod}\\</strong>.</p>`;

export default function ShortCutsExample() {
  return (
    <ExamplePreview
      namespace="example-short-cuts"
      extensions={[StarterKit(), ShortCutsExtension()]}
      content={content}
      placeholder={`Try ${mod}B, ${mod}I, ${mod}U — keyboard shortcuts for every formatting action.`}
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
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";

const extensions = [StarterKit(), ShortCutsExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Try ⌘B / Ctrl+B, ⌘I / Ctrl+I..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
