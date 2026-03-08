import type { FC } from "react";

export interface UseCodeBlockOptions {
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

export interface UseCodeBlockReturn {
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  handleToggle: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface CodeBlockButtonProps {
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onToggled?: () => void;
  className?: string;
}
