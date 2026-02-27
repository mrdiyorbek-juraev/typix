import type { LexicalEditor } from "lexical";

/**
 * Focus the editor.
 */
export function focus(editor: LexicalEditor): void {
  editor.focus();
}

/**
 * Blur the editor.
 */
export function blur(editor: LexicalEditor): void {
  editor.blur();
}

/**
 * Check if the editor is editable.
 */
export function isEditable(editor: LexicalEditor): boolean {
  return editor.isEditable();
}

/**
 * Set the editable state of the editor.
 */
export function setEditable(editor: LexicalEditor, editable: boolean): void {
  editor.setEditable(editable);
}
