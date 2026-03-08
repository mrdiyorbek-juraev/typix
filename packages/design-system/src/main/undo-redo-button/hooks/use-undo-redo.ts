import { useCallback } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import { Undo2, Redo2 } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import type {
  UndoRedoAction,
  UseUndoRedoOptions,
  UseUndoRedoReturn,
} from "../types";
import type { FC } from "react";

interface UndoRedoConfig {
  cmd: string;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const UNDO_REDO_CONFIG: Record<UndoRedoAction, UndoRedoConfig> = {
  undo: {
    cmd: "undo",
    Icon: Undo2,
    label: "Undo",
    macKeys: ["⌘", "Z"],
    winKeys: ["Ctrl", "Z"],
  },
  redo: {
    cmd: "redo",
    Icon: Redo2,
    label: "Redo",
    macKeys: ["⌘", "⇧", "Z"],
    winKeys: ["Ctrl", "Shift", "Z"],
  },
};

export function useUndoRedo(
  action: UndoRedoAction,
  options?: UseUndoRedoOptions
): UseUndoRedoReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const config = UNDO_REDO_CONFIG[action];

  const canExecute = (editor.can() as any)[config.cmd]().run();
  const isVisible = !options?.hideWhenUnavailable || canExecute;

  const handleAction = useCallback(() => {
    (editor.chain().focus() as any)[config.cmd]().run();
    options?.onExecuted?.();
  }, [editor, config.cmd, options]);

  return {
    isVisible,
    canExecute,
    handleAction,
    label: config.label,
    shortcutKeys: isApple ? config.macKeys : config.winKeys,
    Icon: config.Icon,
  };
}

// --- Utility functions (non-hook, for imperative use) ---

export function canExecuteUndoRedo(
  editor: TypixEditor,
  action: UndoRedoAction
): boolean {
  return (editor.can() as any)[UNDO_REDO_CONFIG[action].cmd]().run();
}

export function executeUndoRedo(
  editor: TypixEditor,
  action: UndoRedoAction
): void {
  (editor.chain().focus() as any)[UNDO_REDO_CONFIG[action].cmd]().run();
}
