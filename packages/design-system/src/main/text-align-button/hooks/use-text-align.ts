import { useCallback } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type { TextAlign, UseTextAlignOptions, UseTextAlignReturn } from "../types";
import type { FC } from "react";

interface AlignConfig {
  alignCmd: string;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const ALIGN_CONFIG: Record<TextAlign, AlignConfig> = {
  left: {
    alignCmd: "alignLeft",
    Icon: AlignLeft,
    label: "Align Left",
    macKeys: ["⌘", "⇧", "L"],
    winKeys: ["Ctrl", "Shift", "L"],
  },
  center: {
    alignCmd: "alignCenter",
    Icon: AlignCenter,
    label: "Align Center",
    macKeys: ["⌘", "⇧", "E"],
    winKeys: ["Ctrl", "Shift", "E"],
  },
  right: {
    alignCmd: "alignRight",
    Icon: AlignRight,
    label: "Align Right",
    macKeys: ["⌘", "⇧", "R"],
    winKeys: ["Ctrl", "Shift", "R"],
  },
  justify: {
    alignCmd: "alignJustify",
    Icon: AlignJustify,
    label: "Justify",
    macKeys: ["⌘", "⇧", "J"],
    winKeys: ["Ctrl", "Shift", "J"],
  },
};

export function useTextAlign(
  align: TextAlign,
  options?: UseTextAlignOptions,
): UseTextAlignReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const config = ALIGN_CONFIG[align];

  const canAlign = editor
    .can()
    [config.alignCmd as keyof ReturnType<typeof editor.can>]()
    .run();
  const isVisible = !options?.hideWhenUnavailable || canAlign;

  const handleTextAlign = useCallback(() => {
    (editor.chain().focus() as any)[config.alignCmd]().run();
    options?.onAligned?.();
  }, [editor, config.alignCmd, options]);

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

export function canSetTextAlign(editor: TypixEditor, align: TextAlign): boolean {
  const cmd = ALIGN_CONFIG[align].alignCmd;
  return editor.can()[cmd]().run();
}

export function setTextAlign(editor: TypixEditor, align: TextAlign): void {
  const cmd = ALIGN_CONFIG[align].alignCmd;
  editor.chain().focus()[cmd]().run();
}
