import { FORMAT_ELEMENT_COMMAND, type LexicalEditor } from "lexical";
import type { ElementAlignment } from "../constants";

/**
 * Set the alignment of the current block element.
 */
export function formatAlign(
  editor: LexicalEditor,
  alignment: ElementAlignment
): void {
  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
}

/**
 * Align the current block element to the left.
 */
export function alignLeft(editor: LexicalEditor): void {
  formatAlign(editor, "left");
}

/**
 * Align the current block element to the center.
 */
export function alignCenter(editor: LexicalEditor): void {
  formatAlign(editor, "center");
}

/**
 * Align the current block element to the right.
 */
export function alignRight(editor: LexicalEditor): void {
  formatAlign(editor, "right");
}

/**
 * Justify the current block element.
 */
export function alignJustify(editor: LexicalEditor): void {
  formatAlign(editor, "justify");
}

/**
 * Align to the start (LTR: left, RTL: right).
 */
export function alignStart(editor: LexicalEditor): void {
  formatAlign(editor, "start");
}

/**
 * Align to the end (LTR: right, RTL: left).
 */
export function alignEnd(editor: LexicalEditor): void {
  formatAlign(editor, "end");
}
