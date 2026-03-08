import { useCallback, useState } from "react";
import { useTypixEditorState } from "@typix-editor/react";
import { Highlighter } from "lucide-react";
import type {
  UseColorHighlightOptions,
  UseColorHighlightReturn,
} from "../types";

export const HIGHLIGHT_COLORS = [
  "yellow",
  "amber",
  "orange",
  "lime",
  "green",
  "cyan",
  "sky",
  "pink",
  "rose",
  "fuchsia",
] as const;

export type HighlightColorKey = (typeof HIGHLIGHT_COLORS)[number];

/**
 * Accessible highlight background colors.
 * Uses color-mix with 30% opacity so text stays readable on both
 * light and dark backgrounds (WCAG-friendly).
 */
export const HIGHLIGHT_COLOR_VALUES: Record<string, string> = {
  yellow: "color-mix(in srgb, var(--color-yellow-400) 30%, transparent)",
  amber: "color-mix(in srgb, var(--color-amber-400) 30%, transparent)",
  orange: "color-mix(in srgb, var(--color-orange-400) 30%, transparent)",
  lime: "color-mix(in srgb, var(--color-lime-400) 30%, transparent)",
  green: "color-mix(in srgb, var(--color-green-400) 30%, transparent)",
  cyan: "color-mix(in srgb, var(--color-cyan-400) 30%, transparent)",
  sky: "color-mix(in srgb, var(--color-sky-400) 30%, transparent)",
  pink: "color-mix(in srgb, var(--color-pink-400) 30%, transparent)",
  rose: "color-mix(in srgb, var(--color-rose-400) 30%, transparent)",
  fuchsia: "color-mix(in srgb, var(--color-fuchsia-400) 30%, transparent)",
};

export function useColorHighlight(
  options?: UseColorHighlightOptions
): UseColorHighlightReturn {
  const editor = useTypixEditorState();
  const [selectedColor, setSelectedColor] = useState<string>(
    options?.defaultColor ?? "yellow"
  );

  const isActive = editor.isActive("highlight");
  const canToggle = editor.can().toggleHighlight().run();
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  const handleToggle = useCallback(() => {
    const colorValue =
      HIGHLIGHT_COLOR_VALUES[selectedColor] ?? HIGHLIGHT_COLOR_VALUES.yellow;

    if (isActive) {
      editor.chain().focus().toggleHighlight().removeHighlightColor().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHighlight()
        .setHighlightColor({ color: colorValue })
        .run();
    }
    options?.onToggled?.();
  }, [editor, isActive, selectedColor, options]);

  const handleColorSelected = useCallback(
    (color: string) => {
      setSelectedColor(color);
      const colorValue =
        HIGHLIGHT_COLOR_VALUES[color] ?? HIGHLIGHT_COLOR_VALUES.yellow;

      if (isActive) {
        // Update color on already-highlighted text
        editor.chain().focus().setHighlightColor({ color: colorValue }).run();
      } else {
        // Apply highlight with the selected color
        editor
          .chain()
          .focus()
          .toggleHighlight()
          .setHighlightColor({ color: colorValue })
          .run();
      }
      options?.onColorSelected?.(color);
    },
    [editor, isActive, options]
  );

  const handleRemoveHighlight = useCallback(() => {
    if (isActive) {
      editor.chain().focus().toggleHighlight().removeHighlightColor().run();
    }
  }, [editor, isActive]);

  return {
    isVisible,
    isActive,
    canToggle,
    selectedColor,
    handleToggle,
    handleColorSelected,
    handleRemoveHighlight,
    label: "Highlight",
    shortcutKeys: [],
    Icon: Highlighter,
    highlightColors: HIGHLIGHT_COLORS,
  };
}
