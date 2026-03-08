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
import type { EditorContextMenuItem } from "@typix-editor/ui";

export const contextMenuItems: EditorContextMenuItem[] = [
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
