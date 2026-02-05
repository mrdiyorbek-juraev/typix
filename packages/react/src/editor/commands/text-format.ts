import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
  type TextFormatType,
} from "lexical";
import { TEXT_FORMAT_TYPES } from "../constants";

/**
 * Toggle a text format on the current selection.
 */
export function toggleFormat(editor: LexicalEditor, format: TextFormatType): void {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
}

/**
 * Toggle bold formatting.
 */
export function toggleBold(editor: LexicalEditor): void {
  toggleFormat(editor, "bold");
}

/**
 * Toggle italic formatting.
 */
export function toggleItalic(editor: LexicalEditor): void {
  toggleFormat(editor, "italic");
}

/**
 * Toggle underline formatting.
 */
export function toggleUnderline(editor: LexicalEditor): void {
  toggleFormat(editor, "underline");
}

/**
 * Toggle strikethrough formatting.
 */
export function toggleStrikethrough(editor: LexicalEditor): void {
  toggleFormat(editor, "strikethrough");
}

/**
 * Toggle inline code formatting.
 */
export function toggleCode(editor: LexicalEditor): void {
  toggleFormat(editor, "code");
}

/**
 * Toggle subscript formatting.
 */
export function toggleSubscript(editor: LexicalEditor): void {
  toggleFormat(editor, "subscript");
}

/**
 * Toggle superscript formatting.
 */
export function toggleSuperscript(editor: LexicalEditor): void {
  toggleFormat(editor, "superscript");
}

/**
 * Toggle highlight formatting.
 */
export function toggleHighlight(editor: LexicalEditor): void {
  toggleFormat(editor, "highlight");
}

/**
 * Clear all text formatting from the current selection.
 */
export function clearFormatting(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchor = selection.anchor;
    const focus = selection.focus;
    const nodes = selection.getNodes();

    if (anchor.key === focus.key && anchor.offset === focus.offset) {
      return;
    }

    for (const node of nodes) {
      if ($isTextNode(node)) {
        let textNode = node;
        for (const format of TEXT_FORMAT_TYPES) {
          if (textNode.hasFormat(format)) {
            textNode = textNode.toggleFormat(format);
          }
        }
        if (textNode.getStyle() !== "") {
          textNode.setStyle("");
        }
      }
    }
  });
}
