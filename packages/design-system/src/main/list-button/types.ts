import type { FC } from "react";

export type ListType = "bullet" | "ordered" | "check";

export interface UseListOptions {
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

export interface UseListReturn {
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  handleToggle: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface ListButtonProps {
  type: ListType;
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onToggled?: () => void;
  className?: string;
}
