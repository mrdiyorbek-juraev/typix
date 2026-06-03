import { useCallback } from "react";
import type {
  TypixEditor,
  ChainBuilder,
  CanChainBuilder,
} from "@typix-editor/core";
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
  apply: (chain: ChainBuilder) => ChainBuilder;
  canApply: (can: CanChainBuilder) => CanChainBuilder;
  Icon: FC;
  label: string;
  macKeys: string[];
  winKeys: string[];
}

const UNDO_REDO_CONFIG: Record<UndoRedoAction, UndoRedoConfig> = {
  undo: {
    apply: (c) => c.undo(),
    canApply: (c) => c.undo(),
    Icon: Undo2,
    label: "Undo",
    macKeys: ["⌘", "Z"],
    winKeys: ["Ctrl", "Z"],
  },
  redo: {
    apply: (c) => c.redo(),
    canApply: (c) => c.redo(),
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

  const canExecute = config.canApply(editor.can()).run();
  const isVisible = !options?.hideWhenUnavailable || canExecute;

  const handleAction = useCallback(() => {
    config.apply(editor.chain().focus()).run();
    options?.onExecuted?.();
  }, [editor, config, options]);

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
  return UNDO_REDO_CONFIG[action].canApply(editor.can()).run();
}

export function executeUndoRedo(
  editor: TypixEditor,
  action: UndoRedoAction
): void {
  UNDO_REDO_CONFIG[action].apply(editor.chain().focus()).run();
}
