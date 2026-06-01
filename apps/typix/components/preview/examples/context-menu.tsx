"use client";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import type { EditorContextMenuItem } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const menuItems: EditorContextMenuItem[] = [
  { type: "label", label: "Format" },
  {
    type: "item",
    label: "Bold",
    icon: <Bold />,
    shortcut: "⌘B",
    onSelect: (editor) => (editor.chain() as any).toggleBold().run(),
  },
  {
    type: "item",
    label: "Italic",
    icon: <Italic />,
    shortcut: "⌘I",
    onSelect: (editor) => (editor.chain() as any).toggleItalic().run(),
  },
  {
    type: "item",
    label: "Underline",
    icon: <Underline />,
    shortcut: "⌘U",
    onSelect: (editor) => (editor.chain() as any).toggleUnderline().run(),
  },
  {
    type: "item",
    label: "Strikethrough",
    icon: <Strikethrough />,
    onSelect: (editor) => (editor.chain() as any).toggleStrike().run(),
  },
  { type: "separator" },
  { type: "label", label: "Lists" },
  {
    type: "item",
    label: "Bullet List",
    icon: <List />,
    onSelect: (editor) => (editor.chain() as any).toggleBulletList().run(),
  },
  {
    type: "item",
    label: "Numbered List",
    icon: <ListOrdered />,
    onSelect: (editor) => (editor.chain() as any).toggleOrderedList().run(),
  },
  { type: "separator" },
  {
    type: "item",
    label: "Undo",
    icon: <Undo2 />,
    shortcut: "⌘Z",
    onSelect: (editor) => (editor.chain() as any).undo().run(),
  },
  {
    type: "item",
    label: "Redo",
    icon: <Redo2 />,
    shortcut: "⌘⇧Z",
    onSelect: (editor) => (editor.chain() as any).redo().run(),
  },
];

const content = `<p>Right-click anywhere in this editor to open the custom context menu. It replaces the browser default with formatting shortcuts and editor actions.</p><p>Select some text first to see additional options like <strong>bold</strong>, <em>italic</em>, and <u>underline</u>.</p>`;

export default function ContextMenuExample() {
  return (
    <ExamplePreview
      namespace="example-context-menu"
      extensions={[StarterKit(), ContextMenuExtension()]}
      content={content}
      placeholder="Right-click anywhere in the editor for the custom context menu."
      contextMenuItems={menuItems}
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
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import { EditorContextMenu } from "@/components/typix/main/context-menu";
import { Bold, Italic, Underline, Undo2, Redo2 } from "lucide-react";

const menuItems = [
  { type: "label", label: "Format" },
  { type: "item", label: "Bold", icon: <Bold />, shortcut: "⌘B", onSelect: (editor) => editor.chain().toggleBold().run() },
  { type: "item", label: "Italic", icon: <Italic />, shortcut: "⌘I", onSelect: (editor) => editor.chain().toggleItalic().run() },
  { type: "item", label: "Underline", icon: <Underline />, shortcut: "⌘U", onSelect: (editor) => editor.chain().toggleUnderline().run() },
  { type: "separator" },
  { type: "item", label: "Undo", icon: <Undo2 />, shortcut: "⌘Z", onSelect: (editor) => editor.chain().undo().run() },
  { type: "item", label: "Redo", icon: <Redo2 />, shortcut: "⌘⇧Z", onSelect: (editor) => editor.chain().redo().run() },
];

const extensions = [StarterKit(), ContextMenuExtension()];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContextMenu items={menuItems}>
        <EditorContent editor={editor} placeholder="Right-click for menu..." />
      </EditorContextMenu>
    </TypixEditorContext.Provider>
  );
}`,
  },
];
