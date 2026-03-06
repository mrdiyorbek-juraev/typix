"use client";

import { defaultTheme, EditorContent, EditorRoot } from "@typix-editor/react";
import { CharacterLimit, DraggableBlock, EditorContextMenu, FloatingLinkUI, MentionUI, type EditorContextMenuItem } from "@typix-editor/ui";
import type { MentionItem } from "@typix-editor/extension-mention";
import { Copy, Scissors, Clipboard, Trash2 } from "lucide-react";
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  $getRoot,
  $createParagraphNode,
} from "lexical";
import { Toolbar } from "./toolbar";
import { DirectionPanel } from "./direction-panel";
import { editorExtensions } from "./extensions";
import { TablePlugin, TableCellResizer } from "./table-plugin";
import { CodeBlockPlugin } from "./code-block-plugin";

const contextMenuItems: EditorContextMenuItem[] = [
  {
    type: "item",
    label: "Cut",
    icon: <Scissors />,
    shortcut: "Ctrl+X",
    onSelect: (editor) => {
      editor.lexical.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          navigator.clipboard.writeText(selection.getTextContent());
        }
      });
      editor.lexical.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.removeText();
      });
    },
  },
  {
    type: "item",
    label: "Copy",
    icon: <Copy />,
    shortcut: "Ctrl+C",
    onSelect: (editor) => {
      editor.lexical.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          navigator.clipboard.writeText(selection.getTextContent());
        }
      });
    },
  },
  {
    type: "item",
    label: "Paste",
    icon: <Clipboard />,
    shortcut: "Ctrl+V",
    onSelect: (editor) => {
      navigator.clipboard.readText().then((text) => {
        if (!text) return;
        editor.lexical.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertRawText(text);
          } else {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(text));
            $getRoot().append(paragraph);
          }
        });
      }).catch(() => {
        // clipboard-read permission denied — browser blocked it
      });
    },
  },
  { type: "separator" },
  {
    type: "item",
    label: "Delete",
    icon: <Trash2 />,
    onSelect: (editor) => {
      editor.lexical.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.removeText();
        }
      });
    },
  },
];

const SAMPLE_USERS: MentionItem[] = [
  { id: "1", name: "Alice Johnson", data: { username: "@alice", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice" } },
  { id: "2", name: "Bob Smith", data: { username: "@bob", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob" } },
  { id: "3", name: "Charlie Brown", data: { username: "@charlie", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie" } },
  { id: "4", name: "Diana Prince", data: { username: "@diana", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Diana" } },
  { id: "5", name: "Edward Norton", data: { username: "@edward", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Edward" } },
];

function searchMentions(query: string): MentionItem[] {
  const lower = query.toLowerCase();
  return SAMPLE_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(lower) ||
      (user.data?.username as string)?.toLowerCase().includes(lower)
  );
}

export default function BasicEditor() {
  return (
    <EditorRoot
      extensions={editorExtensions}
      namespace="typix-basic"
      theme={defaultTheme}
      onChange={() => { }}
      onContentChange={() => { }}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <Toolbar />
        <DirectionPanel />
        <EditorContextMenu className="" items={contextMenuItems}>
          <EditorContent
            className="min-h-[400px] p-4 text-sm focus:outline-none"
            placeholder="Start typing..."
          />
        </EditorContextMenu>
        <CodeBlockPlugin />
        <TablePlugin />
        <TableCellResizer />
        <FloatingLinkUI />
        <MentionUI onSearch={searchMentions} />
        <DraggableBlock />
        <CharacterLimit maxLength={500} />
      </div>
    </EditorRoot>
  );
}
