"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { KeywordsExtension } from "@typix-editor/extension-keywords";
import { ExamplePreview } from "../example-preview";

const KEYWORDS = ["TODO", "FIXME", "BUG", "DONE", "BLOCKED", "REVIEW"];

const content = `<p>Auth service is throwing intermittent 401s in staging. FIXME: the token refresh logic doesn't handle clock skew between services. BLOCKED on the infra team rotating the signing keys first.</p><p>Payment flow is DONE and passing all integration tests. REVIEW: double-check the idempotency key logic before shipping to prod.</p><p>TODO: add retry backoff to the webhook dispatcher — it currently hammers the endpoint on failure. BUG: duplicate events are fired when the user submits the form twice in quick succession.</p>`;

export default function KeywordsExample() {
  return (
    <ExamplePreview
      namespace="example-keywords"
      extensions={[StarterKit(), KeywordsExtension({ keywords: KEYWORDS })]}
      content={content}
      placeholder="Type TODO, FIXME, BUG, DONE, BLOCKED, or REVIEW — they highlight automatically."
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
import { KeywordsExtension } from "@typix-editor/extension-keywords";

const KEYWORDS = ["TODO", "FIXME", "BUG", "DONE", "BLOCKED", "REVIEW"];

const extensions = [
  StarterKit(),
  KeywordsExtension({ keywords: KEYWORDS }),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type a keyword..." />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
