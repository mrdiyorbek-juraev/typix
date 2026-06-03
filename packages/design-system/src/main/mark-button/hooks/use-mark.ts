import { useCallback } from "react";
import type {
  TypixEditor,
  ChainBuilder,
  CanChainBuilder,
} from "@typix-editor/core";
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
  apply: (chain: ChainBuilder) => ChainBuilder;
  canApply: (can: CanChainBuilder) => CanChainBuilder;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const MARK_CONFIG: Record<MarkType, MarkConfig> = {
  bold: {
    activeName: "bold",
    apply: (c) => c.toggleBold(),
    canApply: (c) => c.toggleBold(),
    Icon: Bold,
    label: "Bold",
    macKeys: ["⌘", "B"],
    winKeys: ["Ctrl", "B"],
  },
  italic: {
    activeName: "italic",
    apply: (c) => c.toggleItalic(),
    canApply: (c) => c.toggleItalic(),
    Icon: Italic,
    label: "Italic",
    macKeys: ["⌘", "I"],
    winKeys: ["Ctrl", "I"],
  },
  underline: {
    activeName: "underline",
    apply: (c) => c.toggleUnderline(),
    canApply: (c) => c.toggleUnderline(),
    Icon: Underline,
    label: "Underline",
    macKeys: ["⌘", "U"],
    winKeys: ["Ctrl", "U"],
  },
  strike: {
    activeName: "strikethrough",
    apply: (c) => c.toggleStrike(),
    canApply: (c) => c.toggleStrike(),
    Icon: Strikethrough,
    label: "Strikethrough",
    macKeys: ["⌘", "⇧", "S"],
    winKeys: ["Ctrl", "Shift", "S"],
  },
  code: {
    activeName: "code",
    apply: (c) => c.toggleInlineCode(),
    canApply: (c) => c.toggleInlineCode(),
    Icon: Code,
    label: "Code",
    macKeys: ["⌘", "E"],
    winKeys: ["Ctrl", "E"],
  },
  superscript: {
    activeName: "superscript",
    apply: (c) => c.toggleSuperscript(),
    canApply: (c) => c.toggleSuperscript(),
    Icon: Superscript,
    label: "Superscript",
    macKeys: ["⌘", "."],
    winKeys: ["Ctrl", "."],
  },
  subscript: {
    activeName: "subscript",
    apply: (c) => c.toggleSubscript(),
    canApply: (c) => c.toggleSubscript(),
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
  const canToggle = config.canApply(editor.can()).run();
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  const handleToggle = useCallback(() => {
    config.apply(editor.chain().focus()).run();
    options?.onToggled?.();
  }, [editor, config, options]);

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
  return MARK_CONFIG[type].canApply(editor.can()).run();
}

export function toggleMark(editor: TypixEditor, type: MarkType): void {
  MARK_CONFIG[type].apply(editor.chain().focus()).run();
}
