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

// ── Extension API ──────────────────────────────────────
// Pattern:  withTypixMeta(defineExtension({...}), {commands, shortcuts, storage, onCreate})
export {
    withTypixMeta,
    ExtensionRegistry,
    configExtension,
    TYPIX_META,
    getTypixExtensionMeta,
    registerExtensionOutput,
    getExtensionOutput,
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
    EditorState,
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
// Lexical node types and primitives (for extensions)
// ─────────────────────────────────────────────────────
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
} from './lib/editor'
export type { Klass, LexicalNode, LexicalNodeReplacement, BaseSelection, DOMConversionMap, DOMConversionOutput, DOMExportOutput, NodeKey, SerializedLexicalNode, Spread } from './lib/editor'
