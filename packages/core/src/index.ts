// ─────────────────────────────────────────────────────
// @typix/core — public API
// ─────────────────────────────────────────────────────

// Main factory
export { createTypix } from './editor/create'

// Extension primitives
export { ExtensionRegistry, configExtension } from './editor/extension'

// Event emitter (useful for framework adapters)
export { TypixEventEmitter } from './editor/event'

// Chain builder (exposed for framework adapters and testing)
export { createChainBuilder, createCanChainBuilder } from './editor/chain'

// Low-level command helpers (useful when writing custom extensions)
export {
  executeBuiltinCommand,
  isMarkActive,
  getEditorText,
  getEditorHTML,
  setEditorContent,
  isEditorEmpty,
} from './editor/command'

// All TypeScript types
export type {
  // Editor
  TypixEditorInstance,
  CreateTypixOptions,

  // Content
  SerializedContent,
  SerializedRootNode,
  SerializedNode,

  // Lexical interop
  AnyLexicalExtension,

  // Events
  TypixEventMap,
  TypixEventName,
  TypixEventListener,

  // Chain
  ChainBuilder,
  CanChainBuilder,
} from './types'

// Typix metadata system (for native Lexical extensions)
export {
  registerTypixMeta,
  getTypixMeta,
  resolveTypixMeta,
  mergeTypixMeta,
  typixExtension,
  registerExtensionOutput,
  getExtensionOutput,
} from './meta'
export type { TypixMeta, TypixCommandMap, TypixShortcut } from './meta'

// ─────────────────────────────────────────────────────
// Editor class + constants
// ─────────────────────────────────────────────────────
export { TypixEditor } from './editor/editor'
export {
  type BlockType,
  type ElementAlignment,
  type HeadingLevel,
  DEFAULT_FONT_SIZE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  ELEMENT_ALIGNMENTS,
  ELEMENT_FORMAT_OPTIONS,
  TEXT_FORMAT_TYPES,
} from './editor/constants'

// ─────────────────────────────────────────────────────
// Lexical node types and primitives (for extensions)
// ─────────────────────────────────────────────────────
export {
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $setBlocksType,
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $createHeadingNode,
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
} from './lib/editor'
export type { Klass, LexicalNode, LexicalNodeReplacement } from './lib/editor'




