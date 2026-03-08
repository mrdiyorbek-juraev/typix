import type { FC } from "react";

export interface UseColorTextOptions {
  defaultColor?: string;
  hideWhenUnavailable?: boolean;
  onColorSelected?: (color: string) => void;
}

export interface UseColorTextReturn {
  isVisible: boolean;
  isActive: boolean;
  isHighlightActive: boolean;
  selectedColor: string;
  handleColorSelected: (color: string) => void;
  handleHighlightSelected: (color: string) => void;
  handleRemoveColor: () => void;
  handleRemoveHighlight: () => void;
  label: string;
  Icon: FC;
  textColors: readonly string[];
  highlightColors: readonly string[];
}

export interface ColorTextButtonProps {
  text?: string;
  defaultColor?: string;
  hideWhenUnavailable?: boolean;
  onColorSelected?: (color: string) => void;
  className?: string;
}
