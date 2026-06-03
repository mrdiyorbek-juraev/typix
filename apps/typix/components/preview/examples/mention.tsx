"use client";

import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import type { MentionItem } from "@typix-editor/extension-mention";
import { MentionExtension } from "@typix-editor/extension-mention";
import { MentionUI } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const MOCK_USERS: MentionItem[] = [
  { id: "1", name: "Alice Chen", data: { username: "@alice" } },
  { id: "2", name: "Bob Smith", data: { username: "@bob" } },
  { id: "3", name: "Charlie Park", data: { username: "@charlie" } },
  { id: "4", name: "Diana Ross", data: { username: "@diana" } },
  { id: "5", name: "Evan Li", data: { username: "@evan" } },
  { id: "6", name: "Fiona Wu", data: { username: "@fiona" } },
];

function searchUsers(query: string): MentionItem[] {
  const q = query.toLowerCase();
  return MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      (u.data?.username as string)?.toLowerCase().includes(q)
  );
}

const content = `<p>Type <strong>@</strong> anywhere to open the mention picker and tag a user. Start typing a name to filter the list, then press Enter or click to insert the mention.</p>`;

export default function MentionExample() {
  return (
    <ExamplePreview
      namespace="example-mention"
      extensions={[
        StarterKit(),
        configExtension(MentionExtension, { trigger: "@" }),
      ]}
      content={content}
      placeholder="Type @ to open the mention picker."
      overlays={<MentionUI onSearch={searchUsers} />}
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
import { MentionExtension } from "@typix-editor/extension-mention";
import { MentionUI } from "@/components/typix/main/mention";

const extensions = [
  StarterKit(),
  configExtension(MentionExtension, { trigger: "@" }),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type @ to mention..." />
      <MentionUI />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
