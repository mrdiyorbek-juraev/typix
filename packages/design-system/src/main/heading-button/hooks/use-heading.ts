import { useCallback } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type {
  HeadingLevel,
  UseHeadingOptions,
  UseHeadingReturn,
} from "../types";
import type { FC } from "react";

interface HeadingConfig {
  activeName: string;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const HEADING_CONFIG: Record<HeadingLevel, HeadingConfig> = {
  1: {
    activeName: "h1",
    Icon: Heading1,
    label: "Heading 1",
    macKeys: ["⌘", "⌥", "1"],
    winKeys: ["Ctrl", "Alt", "1"],
  },
  2: {
    activeName: "h2",
    Icon: Heading2,
    label: "Heading 2",
    macKeys: ["⌘", "⌥", "2"],
    winKeys: ["Ctrl", "Alt", "2"],
  },
  3: {
    activeName: "h3",
    Icon: Heading3,
    label: "Heading 3",
    macKeys: ["⌘", "⌥", "3"],
    winKeys: ["Ctrl", "Alt", "3"],
  },
  4: {
    activeName: "h4",
    Icon: Heading4,
    label: "Heading 4",
    macKeys: ["⌘", "⌥", "4"],
    winKeys: ["Ctrl", "Alt", "4"],
  },
  5: {
    activeName: "h5",
    Icon: Heading5,
    label: "Heading 5",
    macKeys: ["⌘", "⌥", "5"],
    winKeys: ["Ctrl", "Alt", "5"],
  },
  6: {
    activeName: "h6",
    Icon: Heading6,
    label: "Heading 6",
    macKeys: ["⌘", "⌥", "6"],
    winKeys: ["Ctrl", "Alt", "6"],
  },
};

export function useHeading(
  level: HeadingLevel,
  options?: UseHeadingOptions,
): UseHeadingReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const config = HEADING_CONFIG[level];

  const isActive = editor.isActive(config.activeName);
  const canToggle = (editor.can() as any).toggleHeading({ level }).run();
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  const handleToggle = useCallback(() => {
    (editor.chain().focus() as any).toggleHeading({ level }).run();
    options?.onToggled?.();
  }, [editor, level, options]);

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

export function isHeadingActive(
  editor: TypixEditor,
  level: HeadingLevel,
): boolean {
  return editor.isActive(HEADING_CONFIG[level].activeName);
}

export function canToggleHeading(
  editor: TypixEditor,
  level: HeadingLevel,
): boolean {
  return (editor.can() as any).toggleHeading({ level }).run();
}

export function toggleHeading(
  editor: TypixEditor,
  level: HeadingLevel,
): void {
  (editor.chain().focus() as any).toggleHeading({ level }).run();
}
