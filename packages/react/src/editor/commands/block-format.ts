import { $createCodeNode, $isCodeNode } from "@lexical/code";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
} from "lexical";
import type { HeadingLevel } from "../constants";

/**
 * Check if a list type is active.
 */
function isListActive(
  editor: LexicalEditor,
  listType: "bullet" | "number" | "check"
): boolean {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();
    const listNode = $getNearestNodeOfType(element, ListNode);

    if (!(listNode && $isListNode(listNode))) return false;

    const listTagType = listNode.getListType();
    if (listType === "bullet") return listTagType === "bullet";
    if (listType === "number") return listTagType === "number";
    if (listType === "check") return listTagType === "check";
    return false;
  });
}

/**
 * Toggle heading on the current selection.
 */
export function toggleHeading(
  editor: LexicalEditor,
  level: HeadingLevel
): void {
  const headingTag: HeadingTagType = `h${level}`;

  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();
    const elementType = element.getType();
    const elementTag =
      elementType === "heading"
        ? (element as unknown as { getTag: () => string }).getTag()
        : null;

    if (elementTag === headingTag) {
      $setBlocksType(selection, () => $createParagraphNode());
    } else {
      $setBlocksType(selection, () => $createHeadingNode(headingTag));
    }
  });
}

/**
 * Set the current block to a paragraph.
 */
export function setParagraph(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
}

/**
 * Toggle bullet (unordered) list.
 */
export function toggleBulletList(editor: LexicalEditor): void {
  if (isListActive(editor, "bullet")) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }
}

/**
 * Toggle ordered (numbered) list.
 */
export function toggleOrderedList(editor: LexicalEditor): void {
  if (isListActive(editor, "number")) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }
}

/**
 * Toggle check list.
 */
export function toggleCheckList(editor: LexicalEditor): void {
  if (isListActive(editor, "check")) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  }
}

/**
 * Toggle blockquote.
 */
export function toggleQuote(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();

    if ($isQuoteNode(element)) {
      $setBlocksType(selection, () => $createParagraphNode());
    } else {
      $setBlocksType(selection, () => $createQuoteNode());
    }
  });
}

/**
 * Toggle code block.
 */
export function toggleCodeBlock(
  editor: LexicalEditor,
  language?: string
): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();

    if ($isCodeNode(element)) {
      $setBlocksType(selection, () => $createParagraphNode());
    } else {
      $setBlocksType(selection, () =>
        language ? $createCodeNode(language) : $createCodeNode()
      );
    }
  });
}
