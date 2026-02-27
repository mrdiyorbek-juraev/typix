import { type LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from "lexical";

/**
 * Undo the last action.
 */
export function undo(editor: LexicalEditor): void {
  editor.dispatchCommand(UNDO_COMMAND, undefined);
}

/**
 * Redo the last undone action.
 */
export function redo(editor: LexicalEditor): void {
  editor.dispatchCommand(REDO_COMMAND, undefined);
}
