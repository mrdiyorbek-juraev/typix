import { $isCodeNode } from "@lexical/code";
import { $isListNode, ListNode } from "@lexical/list";
import { $isQuoteNode } from "@lexical/rich-text";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
  type TextFormatType,
} from "lexical";
import { type BlockType, TEXT_FORMAT_TYPES } from "../constants";

/**
 * Check if a format is currently active on the selection.
 */
export function isActive(
  editor: LexicalEditor,
  format: TextFormatType
): boolean {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return false;
    }
    return selection.hasFormat(format);
  });
}

/**
 * Get all currently active formats on the selection.
 */
export function getActiveFormats(editor: LexicalEditor): Set<TextFormatType> {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    const formats = new Set<TextFormatType>();

    if (!$isRangeSelection(selection)) {
      return formats;
    }

    for (const format of TEXT_FORMAT_TYPES) {
      if (selection.hasFormat(format)) {
        formats.add(format);
      }
    }

    return formats;
  });
}

/**
 * Check if a block type is currently active.
 */
export function isBlockActive(
  editor: LexicalEditor,
  blockType: BlockType
): boolean {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();
    const elementType = element.getType();

    // Check for list types
    if (
      blockType === "bullet" ||
      blockType === "number" ||
      blockType === "check"
    ) {
      const listNode = $getNearestNodeOfType(element, ListNode);
      if (!(listNode && $isListNode(listNode))) return false;
      const listTagType = listNode.getListType();
      if (blockType === "bullet") return listTagType === "bullet";
      if (blockType === "number") return listTagType === "number";
      if (blockType === "check") return listTagType === "check";
      return false;
    }

    // Check for heading types
    if (blockType.startsWith("h")) {
      if (elementType !== "heading") return false;
      const tag = (element as unknown as { getTag: () => string }).getTag();
      return tag === blockType;
    }

    // Check for quote
    if (blockType === "quote") {
      return $isQuoteNode(element);
    }

    // Check for code block
    if (blockType === "code") {
      return $isCodeNode(element);
    }

    // Check for paragraph
    if (blockType === "paragraph") {
      return elementType === "paragraph";
    }

    return false;
  });
}

/**
 * Get the current block type.
 */
export function getBlockType(editor: LexicalEditor): BlockType | null {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();
    const elementType = element.getType();

    // Check for list
    const listNode = $getNearestNodeOfType(element, ListNode);
    if (listNode && $isListNode(listNode)) {
      const listType = listNode.getListType();
      if (listType === "bullet") return "bullet";
      if (listType === "number") return "number";
      if (listType === "check") return "check";
    }

    // Check for quote
    if ($isQuoteNode(element)) {
      return "quote";
    }

    // Check for code block
    if ($isCodeNode(element)) {
      return "code";
    }

    // Check for heading
    if (elementType === "heading") {
      const tag = (element as unknown as { getTag: () => string }).getTag();
      return tag as BlockType;
    }

    // Default to paragraph
    if (elementType === "paragraph") {
      return "paragraph";
    }

    return null;
  });
}
