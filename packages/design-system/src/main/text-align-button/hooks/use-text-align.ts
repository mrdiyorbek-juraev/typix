import { useCallback } from "react";
import type {
  TypixEditor,
  ChainBuilder,
  CanChainBuilder,
} from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type {
  TextAlign,
  UseTextAlignOptions,
  UseTextAlignReturn,
} from "../types";
import type { FC } from "react";

interface AlignConfig {
  apply: (chain: ChainBuilder) => ChainBuilder;
  canApply: (can: CanChainBuilder) => CanChainBuilder;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const ALIGN_CONFIG: Record<TextAlign, AlignConfig> = {
  left: {
    apply: (c) => c.alignLeft(),
    canApply: (c) => c.alignLeft(),
    Icon: AlignLeft,
    label: "Align Left",
    macKeys: ["⌘", "⇧", "L"],
    winKeys: ["Ctrl", "Shift", "L"],
  },
  center: {
    apply: (c) => c.alignCenter(),
    canApply: (c) => c.alignCenter(),
    Icon: AlignCenter,
    label: "Align Center",
    macKeys: ["⌘", "⇧", "E"],
    winKeys: ["Ctrl", "Shift", "E"],
  },
  right: {
    apply: (c) => c.alignRight(),
    canApply: (c) => c.alignRight(),
    Icon: AlignRight,
    label: "Align Right",
    macKeys: ["⌘", "⇧", "R"],
    winKeys: ["Ctrl", "Shift", "R"],
  },
  justify: {
    apply: (c) => c.alignJustify(),
    canApply: (c) => c.alignJustify(),
    Icon: AlignJustify,
    label: "Justify",
    macKeys: ["⌘", "⇧", "J"],
    winKeys: ["Ctrl", "Shift", "J"],
  },
};

export function useTextAlign(
  align: TextAlign,
  options?: UseTextAlignOptions
): UseTextAlignReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const config = ALIGN_CONFIG[align];

  const canAlign = config.canApply(editor.can()).run();
  const isVisible = !options?.hideWhenUnavailable || canAlign;

  const handleTextAlign = useCallback(() => {
    config.apply(editor.chain().focus()).run();
    options?.onAligned?.();
  }, [editor, config, options]);

  return {
    isVisible,
    canAlign,
    handleTextAlign,
    label: config.label,
    shortcutKeys: isApple ? config.macKeys : config.winKeys,
    Icon: config.Icon,
  };
}

// --- Utility functions ---

export function canSetTextAlign(
  editor: TypixEditor,
  align: TextAlign
): boolean {
  return ALIGN_CONFIG[align].canApply(editor.can()).run();
}

export function setTextAlign(editor: TypixEditor, align: TextAlign): void {
  ALIGN_CONFIG[align].apply(editor.chain().focus()).run();
}
