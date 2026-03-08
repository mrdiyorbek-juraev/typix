import { useCallback } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Superscript,
  Subscript,
} from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type { MarkType, UseMarkOptions, UseMarkReturn } from "../types";
import type { FC } from "react";

interface MarkConfig {
  activeName: string;
  toggleCmd: string;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const MARK_CONFIG: Record<MarkType, MarkConfig> = {
  bold: {
    activeName: "bold",
    toggleCmd: "toggleBold",
    Icon: Bold,
    label: "Bold",
    macKeys: ["⌘", "B"],
    winKeys: ["Ctrl", "B"],
  },
  italic: {
    activeName: "italic",
    toggleCmd: "toggleItalic",
    Icon: Italic,
    label: "Italic",
    macKeys: ["⌘", "I"],
    winKeys: ["Ctrl", "I"],
  },
  underline: {
    activeName: "underline",
    toggleCmd: "toggleUnderline",
    Icon: Underline,
    label: "Underline",
    macKeys: ["⌘", "U"],
    winKeys: ["Ctrl", "U"],
  },
  strike: {
    activeName: "strikethrough",
    toggleCmd: "toggleStrike",
    Icon: Strikethrough,
    label: "Strikethrough",
    macKeys: ["⌘", "⇧", "S"],
    winKeys: ["Ctrl", "Shift", "S"],
  },
  code: {
    activeName: "code",
    toggleCmd: "toggleInlineCode",
    Icon: Code,
    label: "Code",
    macKeys: ["⌘", "E"],
    winKeys: ["Ctrl", "E"],
  },
  superscript: {
    activeName: "superscript",
    toggleCmd: "toggleSuperscript",
    Icon: Superscript,
    label: "Superscript",
    macKeys: ["⌘", "."],
    winKeys: ["Ctrl", "."],
  },
  subscript: {
    activeName: "subscript",
    toggleCmd: "toggleSubscript",
    Icon: Subscript,
    label: "Subscript",
    macKeys: ["⌘", ","],
    winKeys: ["Ctrl", ","],
  },
};

export function useMark(
  type: MarkType,
  options?: UseMarkOptions
): UseMarkReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const config = MARK_CONFIG[type];

  const isActive = editor.isActive(config.activeName);
  const canToggle = editor
    .can()
    [config.toggleCmd as keyof ReturnType<typeof editor.can>]()
    .run();
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  const handleToggle = useCallback(() => {
    (editor.chain().focus() as any)[config.toggleCmd]().run();
    options?.onToggled?.();
  }, [editor, config.toggleCmd, options]);

  return {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label: config.label,
    shortcutKeys: isApple ? config.macKeys : config.winKeys,
    Icon: config.Icon,
  };
}

// --- Utility functions (non-hook, for imperative use) ---

export function isMarkActive(editor: TypixEditor, type: MarkType): boolean {
  return editor.isActive(MARK_CONFIG[type].activeName);
}

export function canToggleMark(editor: TypixEditor, type: MarkType): boolean {
  const cmd = MARK_CONFIG[type].toggleCmd;
  return editor.can()[cmd]().run();
}

export function toggleMark(editor: TypixEditor, type: MarkType): void {
  const cmd = MARK_CONFIG[type].toggleCmd;
  editor.chain().focus()[cmd]().run();
}
