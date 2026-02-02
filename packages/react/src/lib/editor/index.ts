import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  ParagraphNode,
  TextNode,
  // LEXICAL CORE TYPES
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { OverflowNode } from "@lexical/overflow";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

export {
  // LEXICAL COMMANDS
  FORMAT_TEXT_COMMAND,
  // LEXICAL DEFAULT NODES
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
  $createHeadingNode,
};

// LEXICAL CORE TYPES
export type { Klass, LexicalNode, LexicalNodeReplacement };
