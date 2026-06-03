import type {
    LexicalEditor,
    EditorThemeClasses,
    AnyLexicalExtension,
    AnyLexicalExtensionArgument,
    LexicalNode,
} from 'lexical'
import type { SerializedContent } from './content'
import type { ChainBuilder, CanChainBuilder } from './commands'
import type {
    TypixEventMap,
    TypixEventName,
    TypixEventListener,
} from './events'
import type {
    ExtensionCommands,
    ExtensionStorage,
    TypixExtension,
} from './extension'

// Keyboard shortcut type lives with the rest of the extension types
// to keep the extension/types dependency one-directional.
import type { TypixShortcut } from './extension'
export type { TypixShortcut }

// ─────────────────────────────────────────────
// Editor creation options
// ─────────────────────────────────────────────

export interface CreateTypixOptions {
    /**
     * Extensions to include. Each item is either a bare Lexical extension
     * or a `configExtension(Ext, { ...config })` tuple — both are accepted.
     */
    extensions: AnyLexicalExtensionArgument[]

    /** Whether the editor starts editable. */
    editable?: boolean

    /** Namespace for this editor instance (used by Lexical internally). */
    namespace?: string

    /** Lexical theme classes. */
    theme?: EditorThemeClasses

    /** Initial content (JSON or HTML string). */
    content?: SerializedContent | string

    nodes?: LexicalNode[]

    /** Called on unhandled editor errors. */
    onError?: (error: Error) => void

    // ── Inline lifecycle hooks ───────────────────
    /** Fires synchronously before the underlying Lexical editor is built. */
    onBeforeCreate?: (payload: TypixEventMap['beforeCreate']) => void
    /** Fires after the editor instance is constructed, before initial content. */
    onCreate?: (payload: TypixEventMap['create']) => void
}

// ─────────────────────────────────────────────
// The editor instance interface (public API)
// ─────────────────────────────────────────────

export interface TypixEditorInstance {
    // ── Identity ──────────────────────────────
    readonly id: string
    readonly namespace: string

    // ── Lifecycle ─────────────────────────────
    /** Mount editor to a DOM element. */
    mount(element: HTMLElement): void
    /** Unmount and clean up all listeners. */
    destroy(): void
    /** Whether the editor has been mounted. */
    readonly isMounted: boolean

    // ── Content ───────────────────────────────
    /** Get editor content as a serializable JSON object. */
    getJSON(): SerializedContent
    /** Get editor content as an HTML string. */
    getHTML(): string
    /** Get plain text content. */
    getText(): string
    /** Replace editor content. */
    setContent(content: SerializedContent | string, emitUpdate?: boolean): void
    /** Clear all content. */
    clearContent(emitUpdate?: boolean): void
    /** Whether the document is empty. */
    isEmpty(): boolean

    // ── State ─────────────────────────────────
    /** Focus the editor. */
    focus(position?: 'start' | 'end' | 'all'): void
    /** Blur the editor. */
    blur(): void
    /** Check if the editor is focused. */
    isFocused(): boolean
    /** Get editable state. */
    isEditable(): boolean
    /** Set editable state. */
    setEditable(editable: boolean): void

    // ── Selection ─────────────────────────────
    /** Check if a mark or block type is active at the current selection. */
    isActive(name: string, attrs?: Record<string, unknown>): boolean
    /** Get attributes of the active node/mark by name. */
    getAttributes(name: string): Record<string, unknown>

    // ── Commands ──────────────────────────────
    /** Start a chainable command sequence. */
    chain(): ChainBuilder
    /** Check if commands can run without executing them. */
    can(): CanChainBuilder
    /** Run a named command directly. */
    run(command: string, ...args: unknown[]): boolean

    // ── Events ────────────────────────────────
    on<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): () => void
    off<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): void
    once<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): () => void

    // ── Escape hatch ──────────────────────────
    /** Direct access to the underlying Lexical editor. */
    readonly lexical: LexicalEditor

    // ── Extensions ────────────────────────────
    /**
     * Typed access to per-editor storage declared by an extension via
     * `withTypixMeta(defineExtension({...}), { storage: () => ... })`.
     */
    storage<E extends TypixExtension>(extension: E): ExtensionStorage<E>
    /**
     * Typed access to an extension's command record. Useful when you
     * want to invoke a single command without going through chain().
     */
    commands<E extends TypixExtension>(extension: E): ExtensionCommands<E>
    /** Get all registered keyboard shortcuts. */
    getShortcuts(): TypixShortcut[]
}

// Re-export AnyLexicalExtension for downstream consumers.
export type { AnyLexicalExtension }
