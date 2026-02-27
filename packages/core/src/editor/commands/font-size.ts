import { $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  type LexicalEditor,
} from "lexical";
import { DEFAULT_FONT_SIZE, MAX_FONT_SIZE, MIN_FONT_SIZE } from "../constants";

/**
 * Set the font size for the current selection.
 */
export function setFontSize(editor: LexicalEditor, size: number): void {
  const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));

  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $patchStyleText(selection, { "font-size": `${clampedSize}px` });
    }
  });
}

/**
 * Get the current font size from the selection.
 */
export function getFontSize(editor: LexicalEditor): number {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return DEFAULT_FONT_SIZE;

    const anchor = selection.anchor.getNode();
    if (!$isTextNode(anchor)) return DEFAULT_FONT_SIZE;

    const style = anchor.getStyle() ?? "";
    const fontSize = style.match(/font-size:\s*(\d+)px/);
    return fontSize?.[1] ? Number.parseInt(fontSize[1], 10) : DEFAULT_FONT_SIZE;
  });
}

/**
 * Increment the font size by a given step.
 */
export function incrementFontSize(editor: LexicalEditor, step = 1): void {
  const currentSize = getFontSize(editor);
  setFontSize(editor, currentSize + step);
}

/**
 * Decrement the font size by a given step.
 */
export function decrementFontSize(editor: LexicalEditor, step = 1): void {
  const currentSize = getFontSize(editor);
  setFontSize(editor, currentSize - step);
}
