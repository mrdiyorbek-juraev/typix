import { useCallback } from "react";
import { useTypixEditorState } from "@typix-editor/react";
import { Code2 } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type { UseCodeBlockOptions, UseCodeBlockReturn } from "../types";

const MAC_KEYS = ["⌘", "⌥", "C"];
const WIN_KEYS = ["Ctrl", "Alt", "C"];

export function useCodeBlock(
  options?: UseCodeBlockOptions
): UseCodeBlockReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();

  const isActive = editor.isActive("code");
  const canToggle = editor.can().toggleCodeBlock().run();
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  const handleToggle = useCallback(() => {
    editor.chain().focus().toggleCodeBlock().run();
    options?.onToggled?.();
  }, [editor, options]);

  return {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label: "Code Block",
    shortcutKeys: isApple ? MAC_KEYS : WIN_KEYS,
    Icon: Code2,
  };
}
