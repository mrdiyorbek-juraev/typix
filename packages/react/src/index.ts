export {
  createCommand,
  createEditorConfig,
  type CommandConfig,
  type CreateEditorConfigOptions,
} from "./config";

export {
  type ContextShape,
  type EditorCommandContextValue,
  EditorCommandProvider,
  useEditorCommand,
  TypixEditorProvider,
  useTypixEditor,
  TypixEditorContext,
  type TypixEditorContextValue,
  RootContext,
  useRootContext,
  type RootContextShape,
  SharedHistoryContext,
  useSharedHistoryContext,
} from "./context";

export {
  type EditorCommandProps,
  type EditorCommandItemBaseProps,
  type CommandMenuItemConfig,
  type EditorCommandItemRenderProps,
  type CommandMenuOption,
  type EditorCommandListProps,
  type EditorCommandEmptyProps,
  type EditorBubbleItemProps,
  type EditorBubbleMenuProps,
  type EditorContentProps,
  type EditorRootProps,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorBubbleItem,
  EditorBubbleMenu,
  EditorContent,
  EditorRoot,
} from "./core";

export {
  TypixEditor,
  TEXT_FORMAT_TYPES,
  type HeadingLevel,
  type BlockType,
} from "./editor";

export {
  useActiveFormats,
  useEditor,
  useMouseListener,
  useRange,
} from "./hooks";

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
  // LEXICAL CORE TYPES
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
} from "./lib";

// Re-export types for direct access
export type { LexicalEditor, TextFormatType } from "./types";


export { defaultExtensionNodes } from "./shared";

export { defaultTheme } from "./theme";

export {
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
  addSwipeRightListener,
  validateUrl,
  sanitizeUrl,
} from "./utils";
