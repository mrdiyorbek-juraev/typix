import type { FC } from "react";

export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "superscript"
  | "subscript";

export interface UseMarkOptions {
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

export interface UseMarkReturn {
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  handleToggle: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface MarkButtonProps {
  type: MarkType;
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onToggled?: () => void;
  className?: string;
}
