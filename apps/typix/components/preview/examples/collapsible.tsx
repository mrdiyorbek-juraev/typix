"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import {
  CollapsibleExtension,
  INSERT_COLLAPSIBLE_COMMAND,
} from "@typix-editor/extension-collapsible";
import { SlashCommandExtension } from "@typix-editor/extension-slash-command";
import { SlashDropdownMenu } from "@typix-editor/ui";
import { ChevronsUpDown } from "lucide-react";
import { ExamplePreview } from "../example-preview";

const collapsibleItem = {
  type: "collapsible",
  title: "Collapsible",
  subtext: "Insert a toggleable section",
  aliases: ["toggle", "accordion", "details", "collapsible"],
  badge: ChevronsUpDown,
  group: "Blocks",
  onSelect: ({ editor }: { editor: any }) => {
    editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
  },
};

const content = `<p>Type <strong>/</strong> to open the command menu and select <strong>Collapsible</strong> — or type <strong>/collapsible</strong> to filter directly. Click the arrow on any collapsible block to toggle it open or closed.</p>`;

export default function CollapsibleExample() {
  return (
    <ExamplePreview
      namespace="example-collapsible"
      extensions={[StarterKit(), CollapsibleExtension, SlashCommandExtension]}
      content={content}
      placeholder="Type / to insert a collapsible block."
      overlays={
        <SlashDropdownMenu config={{ customItems: [collapsibleItem] }} />
      }
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
import { CollapsibleExtension, INSERT_COLLAPSIBLE_COMMAND } from "@typix-editor/extension-collapsible";
import { SlashCommandExtension } from "@typix-editor/extension-slash-command";
import { SlashDropdownMenu } from "@/components/typix/main/slash-command";
import { ChevronsUpDown } from "lucide-react";

const collapsibleItem = {
  type: "collapsible",
  title: "Collapsible",
  subtext: "Insert a toggleable section",
  aliases: ["toggle", "accordion", "details", "collapsible"],
  badge: ChevronsUpDown,
  group: "Blocks",
  onSelect: ({ editor }) => {
    editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
  },
};

const extensions = [StarterKit(), CollapsibleExtension, SlashCommandExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Type / to insert a collapsible block." />
      <SlashDropdownMenu config={{ customItems: [collapsibleItem] }} />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
