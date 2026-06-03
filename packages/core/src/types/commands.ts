import type { LexicalEditor } from 'lexical'
import type { SerializedContent } from './content'

// ─────────────────────────────────────────────
// Built-in command names
// ─────────────────────────────────────────────

/** Mark names handled directly by Lexical's FORMAT_TEXT_COMMAND. */
export type BuiltinMarkName =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'code'
    | 'subscript'
    | 'superscript'
    | 'highlight'

// ─────────────────────────────────────────────
// Typed command surface
// ─────────────────────────────────────────────

/**
 * The merged interface every extension augments to add type-safe commands
 * to `editor.chain()` and `editor.can()`.
 *
 * `R` is the return type so the same declarations work for both
 * `ChainBuilder` (R = ChainBuilder) and `CanChainBuilder` (R = CanChainBuilder).
 *
 * @example Augmenting from an extension package:
 * ```ts
 * declare module '@typix-editor/core' {
 *   interface TypixCommands<R> {
 *     toggleBold(): R
 *     setHeading(attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }): R
 *   }
 * }
 * ```
 */
export interface TypixCommands<R> {
    /** Focus the editor at a position. */
    focus(position?: 'start' | 'end' | 'all'): R
    /** Blur the editor. */
    blur(): R
    /** Replace editor content with a serialized state or HTML string. */
    setContent(content: SerializedContent | string): R
    /** Clear all content. */
    clearContent(): R
    /** Undo the last edit. */
    undo(): R
    /** Redo the last undone edit. */
    redo(): R
    /** Toggle a built-in text mark. */
    toggleMark(name: BuiltinMarkName, attrs?: Record<string, unknown>): R
    // NOTE: block toggles are owned by extensions, not built into the chain.
}

// ─────────────────────────────────────────────
// Chain / Can builders
// ─────────────────────────────────────────────

/**
 * Fluent command queue. Every method returns the builder; only `.run()`
 * executes. Commands beyond the built-ins come from extension augmentation
 * of `TypixCommands<R>` via `declare module '@typix-editor/core'`.
 */
export type ChainBuilder = TypixCommands<ChainBuilder> & {
    /** Execute all queued commands and return whether all succeeded. */
    run(): boolean
}

/**
 * Dry-run sibling of `ChainBuilder`. Same surface, but `.run()` returns
 * whether all queued commands *could* run, without mutating editor state.
 */
export type CanChainBuilder = TypixCommands<CanChainBuilder> & {
    /** True when all queued commands are available. */
    run(): boolean
}

// ─────────────────────────────────────────────
// Command function shape (extension API)
// ─────────────────────────────────────────────

/**
 * The function shape returned by an extension's `commands` factory.
 * A command receives the underlying Lexical editor and returns whether
 * it executed successfully.
 */
export type CommandFn = (editor: LexicalEditor) => boolean

/**
 * Record of command factories an extension exposes. Each entry takes
 * optional args and returns a `CommandFn` to dispatch.
 *
 * @example
 * ```ts
 * commands: () => ({
 *   toggleBold: () => (editor) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
 *   setHeading: (attrs: { level: HeadingLevel }) => (editor) => { ... },
 * })
 * ```
 */
export type CommandFactoryMap = Record<string, (...args: any[]) => CommandFn>
