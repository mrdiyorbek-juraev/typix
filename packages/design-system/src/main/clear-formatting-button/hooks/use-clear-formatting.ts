import { useCallback } from "react";
import { useTypixEditorState } from "@typix-editor/react";
import { RemoveFormatting } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type {
  UseClearFormattingOptions,
  UseClearFormattingReturn,
} from "../types";

const MAC_KEYS = ["⌘", "\\"];
const WIN_KEYS = ["Ctrl", "\\"];

const MARK_NAMES = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "subscript",
  "superscript",
  "highlight",
] as const;

export function useClearFormatting(
  options?: UseClearFormattingOptions
): UseClearFormattingReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();

  const hasAnyMark = MARK_NAMES.some((mark) => editor.isActive(mark));
  const canClear = hasAnyMark;
  const isVisible = !options?.hideWhenUnavailable || canClear;

  const handleClear = useCallback(() => {
    let chain = editor.chain().focus();
    for (const mark of MARK_NAMES) {
      if (editor.isActive(mark)) {
        chain = chain.toggleMark(mark);
      }
    }
    chain.run();
    options?.onCleared?.();
  }, [editor, options]);

  return {
    isVisible,
    canClear,
    handleClear,
    label: "Clear Formatting",
    shortcutKeys: isApple ? MAC_KEYS : WIN_KEYS,
    Icon: RemoveFormatting,
  };
}
