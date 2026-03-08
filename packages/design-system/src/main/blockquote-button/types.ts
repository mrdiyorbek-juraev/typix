import type { FC } from "react";

export interface UseBlockquoteOptions {
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

export interface UseBlockquoteReturn {
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  handleToggle: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface BlockquoteButtonProps {
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onToggled?: () => void;
  className?: string;
}
