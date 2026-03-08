import type { FC } from "react";

export type UndoRedoAction = "undo" | "redo";

export interface UseUndoRedoOptions {
  hideWhenUnavailable?: boolean;
  onExecuted?: () => void;
}

export interface UseUndoRedoReturn {
  isVisible: boolean;
  canExecute: boolean;
  handleAction: () => void;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
}

export interface UndoRedoButtonProps {
  action: UndoRedoAction;
  text?: string;
  hideWhenUnavailable?: boolean;
  showShortcut?: boolean;
  onExecuted?: () => void;
  className?: string;
}
