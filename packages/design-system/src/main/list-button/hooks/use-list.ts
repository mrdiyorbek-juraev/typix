import { useCallback } from "react";
import type {
  TypixEditor,
  ChainBuilder,
  CanChainBuilder,
} from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import { List, ListOrdered, ListChecks } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type { ListType, UseListOptions, UseListReturn } from "../types";
import type { FC } from "react";

export interface ListConfig {
  activeName: string;
  apply: (chain: ChainBuilder) => ChainBuilder;
  canApply: (can: CanChainBuilder) => CanChainBuilder;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

export const LIST_CONFIG: Record<ListType, ListConfig> = {
  bullet: {
    activeName: "bullet",
    apply: (c) => c.toggleBulletList(),
    canApply: (c) => c.toggleBulletList(),
    Icon: List,
    label: "Bullet List",
    macKeys: ["⌘", "⇧", "8"],
    winKeys: ["Ctrl", "Shift", "8"],
  },
  ordered: {
    activeName: "number",
    apply: (c) => c.toggleOrderedList(),
    canApply: (c) => c.toggleOrderedList(),
    Icon: ListOrdered,
    label: "Ordered List",
    macKeys: ["⌘", "⇧", "7"],
    winKeys: ["Ctrl", "Shift", "7"],
  },
  check: {
    activeName: "check",
    apply: (c) => c.toggleCheckList(),
    canApply: (c) => c.toggleCheckList(),
    Icon: ListChecks,
    label: "Task List",
    macKeys: ["⌘", "⇧", "9"],
    winKeys: ["Ctrl", "Shift", "9"],
  },
};

export function useList(
  type: ListType,
  options?: UseListOptions
): UseListReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const config = LIST_CONFIG[type];

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

export function isListActive(editor: TypixEditor, type: ListType): boolean {
  return editor.isActive(LIST_CONFIG[type].activeName);
}

export function canToggleList(editor: TypixEditor, type: ListType): boolean {
  return LIST_CONFIG[type].canApply(editor.can()).run();
}

export function toggleList(editor: TypixEditor, type: ListType): void {
  LIST_CONFIG[type].apply(editor.chain().focus()).run();
}
