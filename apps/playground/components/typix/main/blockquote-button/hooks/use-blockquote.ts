import { useCallback } from "react";
import { useTypixEditorState } from "@typix-editor/react";
import { TextQuote } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type { UseBlockquoteOptions, UseBlockquoteReturn } from "../types";

const MAC_KEYS = ["⌃", "⇧", "Q"];
const WIN_KEYS = ["Ctrl", "Shift", "Q"];

export function useBlockquote(
  options?: UseBlockquoteOptions
): UseBlockquoteReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();

  const isActive = editor.isActive("quote");
  const canToggle = editor.can().toggleBlockquote().run();
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  const handleToggle = useCallback(() => {
    editor.chain().focus().toggleBlockquote().run();
    options?.onToggled?.();
  }, [editor, options]);

  return {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label: "Blockquote",
    shortcutKeys: isApple ? MAC_KEYS : WIN_KEYS,
    Icon: TextQuote,
  };
}
