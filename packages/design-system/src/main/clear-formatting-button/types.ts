import type { FC } from "react";

export interface UseClearFormattingOptions {
  hideWhenUnavailable?: boolean;
  onCleared?: () => void;
}

export interface UseClearFormattingReturn {
  isVisible: boolean;
  canClear: boolean;
  handleClear: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface ClearFormattingButtonProps {
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onCleared?: () => void;
  className?: string;
}
