"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { FloatingLinkUI } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content = `<p>Visit https://typix.dev or browse the docs at https://typix.dev/docs for the full API reference.</p><p>Emails are detected too — try editing hello@typix.dev and watch it become a mailto link.</p>`;

export default function AutoLinkExample() {
  return (
    <ExamplePreview
      namespace="example-auto-link"
      extensions={[
        StarterKit({ autoLink: false }),
        AutoLinkExtension(),
        FloatingLinkExtension,
      ]}
      content={content}
      placeholder="Type a URL like https://typix.dev — it becomes a link as you go."
      overlays={<FloatingLinkUI />}
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
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";

const extensions = [StarterKit({ autoLink: false }), AutoLinkExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type a URL..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
