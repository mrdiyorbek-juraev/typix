import type {
    LexicalEditor,
    EditorState,
    EditorThemeClasses,
    AnyLexicalExtension,
    LexicalNode
} from 'lexical'
import type { TypixShortcut } from '../meta'

// ─────────────────────────────────────────────
// Editor creation options
// ─────────────────────────────────────────────

export interface CreateTypixOptions {
    /** Extensions to include */
    extensions: AnyLexicalExtension[]

    /** Whether the editor starts editable */
    editable?: boolean

    /** Namespace for this editor instance (used by Lexical internally) */
    namespace?: string

    /** Lexical theme classes */
    theme?: EditorThemeClasses

    /** Initial content (JSON or HTML string) */
    content?: SerializedContent | string;

    nodes?: LexicalNode[]

    /** Called on unhandled editor errors */
    onError?: (error: Error) => void
}

// ─────────────────────────────────────────────
// Content / serialization
// ─────────────────────────────────────────────

export type SerializedContent = {
    root: SerializedRootNode
}

export type SerializedRootNode = {
    children: SerializedNode[]
    direction: 'ltr' | 'rtl' | null
    format: number
    indent: number
    type: 'root'
    version: number
}

export type SerializedNode = {
    type: string
    version: number
    [key: string]: unknown
}

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

export type TypixEventMap = {
    /** Fires after every content update */
    update: { editor: TypixEditorInstance; editorState: EditorState }
    /** Fires when editor gains focus */
    focus: { editor: TypixEditorInstance }
    /** Fires when editor loses focus */
    blur: { editor: TypixEditorInstance }
    /** Fires when editor is destroyed */
    destroy: { editor: TypixEditorInstance }
    /** Fires when editable state changes */
    editableChange: { editor: TypixEditorInstance; editable: boolean }
    /** Fires on selection change */
    selectionChange: { editor: TypixEditorInstance }
    /** Fires after a transaction (lower-level than update) */
    transaction: { editor: TypixEditorInstance; editorState: EditorState }
}

export type TypixEventName = keyof TypixEventMap

export type TypixEventListener<TEvent extends TypixEventName> = (
    payload: TypixEventMap[TEvent],
) => void

// ─────────────────────────────────────────────
// The editor instance interface (public API)
// ─────────────────────────────────────────────

export interface TypixEditorInstance {
    // ── Identity ──────────────────────────────
    readonly id: string
    readonly namespace: string

    // ── Lifecycle ─────────────────────────────
    /** Mount editor to a DOM element */
    mount(element: HTMLElement): void
    /** Unmount and clean up all listeners */
    destroy(): void
    /** Whether the editor has been mounted */
    readonly isMounted: boolean

    // ── Content ───────────────────────────────
    /** Get editor content as a serializable JSON object */
    getJSON(): SerializedContent
    /** Get editor content as an HTML string */
    getHTML(): string
    /** Get plain text content */
    getText(): string
    /** Replace editor content */
    setContent(content: SerializedContent | string, emitUpdate?: boolean): void
    /** Clear all content */
    clearContent(emitUpdate?: boolean): void
    /** Whether the document is empty */
    isEmpty(): boolean

    // ── State ─────────────────────────────────
    /** Focus the editor */
    focus(position?: 'start' | 'end' | 'all'): void
    /** Blur the editor */
    blur(): void
    /** Check if the editor is focused */
    isFocused(): boolean
    /** Get / set editable state */
    isEditable(): boolean;

    /** Set editable state */
    setEditable(editable: boolean): void

    // ── Selection ─────────────────────────────
    /** Check if a mark or block type is active at the current selection */
    isActive(name: string, attrs?: Record<string, unknown>): boolean
    /** Get attributes of the active node/mark by name */
    getAttributes(name: string): Record<string, unknown>

    // ── Commands ──────────────────────────────
    /** Start a chainable command sequence */
    chain(): ChainBuilder
    /** Check if commands can run without executing them */
    can(): CanChainBuilder
    /** Run a named command directly */
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
    /** Direct access to the underlying Lexical editor */
    readonly lexical: LexicalEditor

    // ── Extensions ────────────────────────────
    /** Get all registered keyboard shortcuts */
    getShortcuts(): TypixShortcut[]
}

// ─────────────────────────────────────────────
// Chain builder
// ─────────────────────────────────────────────

export interface ChainBuilder {
    /** Execute all queued commands and return whether all succeeded */
    run(): boolean
    /** Focus the editor */
    focus(position?: 'start' | 'end' | 'all'): ChainBuilder
    /** Blur the editor */
    blur(): ChainBuilder
    /** Set content */
    setContent(content: SerializedContent | string): ChainBuilder
    /** Clear content */
    clearContent(): ChainBuilder
    /** Toggle a mark — e.g. chain().toggleMark('bold').run() */
    toggleMark(name: string, attrs?: Record<string, unknown>): ChainBuilder
    /** Toggle a block node — e.g. chain().toggleBlock('heading', { level: 2 }).run() */
    toggleBlock(name: string, attrs?: Record<string, unknown>): ChainBuilder
    /** Allow calling any registered command by name */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [command: string]: any
}

// ─────────────────────────────────────────────
// Can chain builder (availability check)
// ─────────────────────────────────────────────

export interface CanChainBuilder {
    /** Check if all queued commands can run (exist). Returns true/false without executing. */
    run(): boolean
    /** Focus the editor */
    focus(position?: 'start' | 'end' | 'all'): CanChainBuilder
    /** Blur the editor */
    blur(): CanChainBuilder
    /** Set content */
    setContent(content: SerializedContent | string): CanChainBuilder
    /** Clear content */
    clearContent(): CanChainBuilder
    /** Toggle a mark */
    toggleMark(name: string, attrs?: Record<string, unknown>): CanChainBuilder
    /** Toggle a block node */
    toggleBlock(name: string, attrs?: Record<string, unknown>): CanChainBuilder
    /** Allow calling any registered command by name */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [command: string]: any
}

export type { AnyLexicalExtension }
