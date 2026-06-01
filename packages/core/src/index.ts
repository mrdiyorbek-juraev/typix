// ─────────────────────────────────────────────────────
// @typix-editor/core — public API
// ─────────────────────────────────────────────────────

// ── Factory ────────────────────────────────────────────
export { createTypix } from './editor/create'

// ── Editor class + constants ───────────────────────────
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

// ── Extension API (preferred) ──────────────────────────
// Pattern:  withTypixMeta(defineExtension({...}), {commands, shortcuts, storage, onCreate})
export {
    withTypixMeta,
    ExtensionRegistry,
    configExtension,
    TYPIX_META,
    getTypixExtensionMeta,
} from './extension'
export type {
    TypixExtension,
    TypixMetaConfig,
    InternalTypixMeta,
    ExtensionContext,
    ExtensionStorage,
    ExtensionCommands,
} from './extension'

// ── Event emitter (useful for adapter authors) ─────────
export { TypixEventEmitter } from './editor/event'

// ── Chain (exposed for adapters and testing) ───────────
export { createChainBuilder, createCanChainBuilder } from './editor/chain'

// ── Low-level command helpers ──────────────────────────
export {
    executeBuiltinCommand,
    isMarkActive,
    getEditorText,
    getEditorHTML,
    setEditorContent,
    isEditorEmpty,
} from './editor/command'

// ── Public types ───────────────────────────────────────
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
    // Commands (declaration-merge here)
    TypixCommands,
    ChainBuilder,
    CanChainBuilder,
    BuiltinMarkName,
    CommandFn,
    CommandFactoryMap,
    // Shortcuts
    TypixShortcut,
} from './types'

// ─────────────────────────────────────────────────────
// Legacy metadata system (deprecated — kept for backward compat).
// Re-exported via the compat shim. Use `withTypixMeta(defineExtension({...}), {...})` instead.
// ─────────────────────────────────────────────────────
export {
    registerTypixMeta,
    getTypixMeta,
    resolveTypixMeta,
    mergeTypixMeta,
    typixExtension,
    registerExtensionOutput,
    getExtensionOutput,
} from './extension'
export type { TypixMeta, TypixCommandMap } from './extension'

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
