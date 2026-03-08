import type { FC } from "react";

export interface UseColorHighlightOptions {
  defaultColor?: string;
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
  onColorSelected?: (color: string) => void;
}

export interface UseColorHighlightReturn {
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  selectedColor: string;
  handleToggle: () => void;
  handleColorSelected: (color: string) => void;
  handleRemoveHighlight: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
  highlightColors: readonly string[];
}

export interface ColorHighlightButtonProps {
  text?: string;
  defaultColor?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onToggled?: () => void;
  onColorSelected?: (color: string) => void;
  className?: string;
}
