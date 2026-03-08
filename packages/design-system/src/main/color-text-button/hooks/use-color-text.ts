import { useCallback, useState } from "react";
import { useTypixEditorState, useSelectionStyle } from "@typix-editor/react";
import { Type } from "lucide-react";
import type { UseColorTextOptions, UseColorTextReturn } from "../types";

export const TEXT_COLORS = [
  "default",
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "green",
  "cyan",
  "sky",
  "purple",
  "pink",
  "fuchsia",
] as const;

export type TextColorKey = (typeof TEXT_COLORS)[number];

export const TEXT_COLOR_VALUES: Record<string, string> = {
  default: "var(--foreground)",
  gray: "var(--color-gray-500)",
  red: "var(--color-red-500)",
  orange: "var(--color-orange-500)",
  amber: "var(--color-amber-500)",
  yellow: "var(--color-yellow-500)",
  green: "var(--color-green-500)",
  cyan: "var(--color-cyan-500)",
  sky: "var(--color-sky-500)",
  purple: "var(--color-purple-500)",
  pink: "var(--color-pink-500)",
  fuchsia: "var(--color-fuchsia-500)",
};

export const HIGHLIGHT_COLORS_GRID = [
  "yellow",
  "amber",
  "orange",
  "lime",
  "green",
  "cyan",
  "sky",
  "blue",
  "purple",
  "pink",
  "rose",
  "fuchsia",
] as const;

export const HIGHLIGHT_GRID_VALUES: Record<string, string> = {
  yellow: "color-mix(in srgb, var(--color-yellow-400) 30%, transparent)",
  amber: "color-mix(in srgb, var(--color-amber-400) 30%, transparent)",
  orange: "color-mix(in srgb, var(--color-orange-400) 30%, transparent)",
  lime: "color-mix(in srgb, var(--color-lime-400) 30%, transparent)",
  green: "color-mix(in srgb, var(--color-green-400) 30%, transparent)",
  cyan: "color-mix(in srgb, var(--color-cyan-400) 30%, transparent)",
  sky: "color-mix(in srgb, var(--color-sky-400) 30%, transparent)",
  blue: "color-mix(in srgb, var(--color-blue-400) 30%, transparent)",
  purple: "color-mix(in srgb, var(--color-purple-400) 30%, transparent)",
  pink: "color-mix(in srgb, var(--color-pink-400) 30%, transparent)",
  rose: "color-mix(in srgb, var(--color-rose-400) 30%, transparent)",
  fuchsia: "color-mix(in srgb, var(--color-fuchsia-400) 30%, transparent)",
};

export function useColorText(
  options?: UseColorTextOptions
): UseColorTextReturn {
  const editor = useTypixEditorState();
  const currentColor = useSelectionStyle("color", "");
  const [selectedColor, setSelectedColor] = useState<string>(
    options?.defaultColor ?? "default"
  );

  const isActive = currentColor !== "";
  const isVisible = !options?.hideWhenUnavailable;
  const isHighlightActive = editor.isActive("highlight");

  const handleColorSelected = useCallback(
    (color: string) => {
      setSelectedColor(color);
      if (color === "default") {
        editor.chain().focus().removeTextColor().run();
      } else {
        const colorValue = TEXT_COLOR_VALUES[color] ?? TEXT_COLOR_VALUES.red;
        editor.chain().focus().setTextColor({ color: colorValue }).run();
      }
      options?.onColorSelected?.(color);
    },
    [editor, options]
  );

  const handleHighlightSelected = useCallback(
    (color: string) => {
      const colorValue = HIGHLIGHT_GRID_VALUES[color] ?? HIGHLIGHT_GRID_VALUES.yellow;
      if (isHighlightActive) {
        editor.chain().focus().setHighlightColor({ color: colorValue }).run();
      } else {
        editor
          .chain()
          .focus()
          .toggleHighlight()
          .setHighlightColor({ color: colorValue })
          .run();
      }
    },
    [editor, isHighlightActive]
  );

  const handleRemoveColor = useCallback(() => {
    editor.chain().focus().removeTextColor().run();
  }, [editor]);

  const handleRemoveHighlight = useCallback(() => {
    if (isHighlightActive) {
      editor.chain().focus().toggleHighlight().removeHighlightColor().run();
    }
  }, [editor, isHighlightActive]);

  return {
    isVisible,
    isActive,
    isHighlightActive,
    selectedColor,
    handleColorSelected,
    handleHighlightSelected,
    handleRemoveColor,
    handleRemoveHighlight,
    label: "Color",
    Icon: Type,
    textColors: TEXT_COLORS,
    highlightColors: HIGHLIGHT_COLORS_GRID,
  };
}
