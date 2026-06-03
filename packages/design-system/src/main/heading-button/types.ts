import type { FC } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface UseHeadingOptions {
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

export interface UseHeadingReturn {
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  handleToggle: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface HeadingButtonProps {
  level: HeadingLevel;
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onToggled?: () => void;
  className?: string;
}
