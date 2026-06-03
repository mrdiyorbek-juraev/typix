import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $isElementNode,
  type LexicalEditor,
  type LexicalNode,
} from "lexical";

/**
 * Returns true if a slash command can be inserted at the given node/position,
 * or at the current selection if no node is provided.
 */
export function canInsertSlashCommand(
  editor: LexicalEditor,
  node?: LexicalNode,
  _nodePos?: number
): boolean {
  let result = false;

  editor.getEditorState().read(() => {
    if (node !== undefined) {
      result = $isElementNode(node) && node.getChildrenSize() === 0;
      return;
    }

    const selection = $getSelection();
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

    const anchor = selection.anchor;
    const anchorNode = anchor.getNode();

    if ($isTextNode(anchorNode)) {
      const textBeforeCursor = anchorNode
        .getTextContent()
        .slice(0, anchor.offset);
      result = textBeforeCursor.trim() === "";
    } else if ($isElementNode(anchorNode)) {
      result = anchorNode.getChildrenSize() === 0;
    }
  });

  return result;
}

/**
 * Inserts the trigger character at the given node/position, or at the current
 * selection if no node is provided. Returns true optimistically.
 */
export function insertSlashCommand(
  editor: LexicalEditor,
  trigger = "/",
  node?: LexicalNode,
  _nodePos?: number
): boolean {
  if (node !== undefined && $isElementNode(node)) {
    editor.update(() => {
      (node as import("lexical").ElementNode).selectStart();
      const sel = $getSelection();
      if ($isRangeSelection(sel)) {
        sel.insertText(trigger);
      }
    });
  } else {
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) {
        sel.insertText(trigger);
      }
    });
  }

  return true;
}
