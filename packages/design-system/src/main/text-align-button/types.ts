import type { FC } from "react";

export type TextAlign = "left" | "center" | "right" | "justify";

export interface UseTextAlignOptions {
  hideWhenUnavailable?: boolean;
  onAligned?: () => void;
}

export interface UseTextAlignReturn {
  isVisible: boolean;
  canAlign: boolean;
  handleTextAlign: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface TextAlignButtonProps {
  align: TextAlign;
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onAligned?: () => void;
  className?: string;
}
