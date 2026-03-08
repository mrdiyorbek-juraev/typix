import { useCallback } from "react";
import {
  type TypixEditor,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
} from "@typix-editor/core";
import { useTypixEditorState, useSignal } from "@typix-editor/react";
import { getFontSizeState } from "@typix-editor/extension-starter-kit";
import { useIsApple } from "../../../lib/use-is-apple";
import type { UseFontSizeOptions, UseFontSizeReturn } from "../types";

const MAC_INCREASE_KEYS = ["⌘", "⇧", "."];
const MAC_DECREASE_KEYS = ["⌘", "⇧", ","];
const WIN_INCREASE_KEYS = ["Ctrl", "Shift", "."];
const WIN_DECREASE_KEYS = ["Ctrl", "Shift", ","];

export function useFontSize(options?: UseFontSizeOptions): UseFontSizeReturn {
  const editor = useTypixEditorState();
  const state = getFontSizeState(editor.lexical);
  const currentSize = useSignal(state!.currentSize);
  const isApple = useIsApple();

  const isVisible = !options?.hideWhenUnavailable || !!state;
  const canIncrease = currentSize < MAX_FONT_SIZE;
  const canDecrease = currentSize > MIN_FONT_SIZE;

  const handleSetSize = useCallback(
    (size: number) => {
      editor.chain().focus().setFontSize({ size }).run();
      options?.onChanged?.(size);
    },
    [editor, options],
  );

  const handleIncrease = useCallback(() => {
    editor.chain().focus().increaseFontSize().run();
  }, [editor]);

  const handleDecrease = useCallback(() => {
    editor.chain().focus().decreaseFontSize().run();
  }, [editor]);

  return {
    isVisible,
    currentSize,
    canIncrease,
    canDecrease,
    handleSetSize,
    handleIncrease,
    handleDecrease,
    minSize: MIN_FONT_SIZE,
    maxSize: MAX_FONT_SIZE,
    increaseShortcutKeys: isApple ? MAC_INCREASE_KEYS : WIN_INCREASE_KEYS,
    decreaseShortcutKeys: isApple ? MAC_DECREASE_KEYS : WIN_DECREASE_KEYS,
  };
}

// --- Utility functions (non-hook, for imperative use) ---

export function getFontSize(editor: TypixEditor): number {
  const state = getFontSizeState(editor.lexical);
  return state?.currentSize.value ?? DEFAULT_FONT_SIZE;
}

export function setFontSize(editor: TypixEditor, size: number): void {
  editor.chain().focus().setFontSize({ size }).run();
}

export function increaseFontSize(editor: TypixEditor): void {
  editor.chain().focus().increaseFontSize().run();
}

export function decreaseFontSize(editor: TypixEditor): void {
  editor.chain().focus().decreaseFontSize().run();
}
