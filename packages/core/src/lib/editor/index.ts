import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { OverflowNode } from "@lexical/overflow";
import { $createHeadingNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  $setBlocksType,
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  
} from "@lexical/selection";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  $applyNodeReplacement,
  getDOMSelection,
  $getNearestNodeFromDOMNode,
  $parseSerializedNode, 
  DecoratorNode,


  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  CLICK_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  

  // LEXICAL CORE TYPES
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
  type BaseSelection,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,

  ParagraphNode,
  TextNode,
  defineExtension,
  safeCast,
  $getNodeByKey,

} from "lexical";

export {
  // LEXICAL COMMANDS
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  CLICK_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  // LEXICAL NODES



  // LEXICAL DEFAULT NODES
  DecoratorNode,
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  OverflowNode,
  HashtagNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  // LEXICAL UTILS
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $setBlocksType,
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $createHeadingNode,
  $getNodeByKey,
  defineExtension, 
  safeCast,
  getDOMSelection,
  $isNodeSelection,
  $applyNodeReplacement,
  $getNearestNodeFromDOMNode,
  $parseSerializedNode
};

// LEXICAL CORE TYPES
export type { Klass, LexicalNode, LexicalNodeReplacement, BaseSelection, DOMConversionMap, DOMConversionOutput, DOMExportOutput, NodeKey, SerializedLexicalNode, Spread };
