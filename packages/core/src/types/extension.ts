import type { AnyLexicalExtension, LexicalEditor } from 'lexical'
import type { CommandFactoryMap } from './commands'

// ─────────────────────────────────────────────────────
// Keyboard shortcuts (lives here because shortcuts are
// declared as part of extension metadata)
// ─────────────────────────────────────────────────────

/** Keyboard shortcut declaration attached to an extension. */
export interface TypixShortcut {
    /** Single-character key, e.g. "b", "1", "Enter". */
    key: string
    /** Modifiers required for the binding to fire. */
    modifiers: Array<'mod' | 'shift' | 'alt'>
    /** Name of a command exposed by some extension. */
    command: string
    /** Optional arguments forwarded to the command. */
    args?: unknown
}

// ─────────────────────────────────────────────────────
// Lifecycle context
// ─────────────────────────────────────────────────────

/**
 * Context object passed to extension lifecycle hooks.
 * `storage` is the typed storage value returned from `meta.storage()`.
 */
export interface ExtensionContext<Storage> {
    editor: LexicalEditor
    storage: Storage
}

// ─────────────────────────────────────────────────────
// Typix metadata config (passed to withTypixMeta)
// ─────────────────────────────────────────────────────

/**
 * Typix-specific metadata you can attach to any native Lexical extension
 * via `withTypixMeta(extension, meta)`.
 *
 * Contains ONLY Typix concerns — name, dependencies, nodes, register
 * stay in the underlying `defineExtension(...)` call.
 */
export interface TypixMetaConfig<
    Storage = void,
    Commands extends CommandFactoryMap = Record<never, never>,
> {
    /**
     * Factory returning the command record this extension exposes.
     * Each command takes optional args and returns a function that
     * dispatches against the Lexical editor.
     */
    commands?: () => Commands
    /** Keyboard shortcuts bound by the active framework adapter. */
    shortcuts?: TypixShortcut[]
    /**
     * Factory returning the typed per-editor storage. Access via
     * `editor.storage(extension)`.
     */
    storage?: () => Storage
    /** Called once after the editor instance is constructed. */
    onCreate?: (ctx: ExtensionContext<Storage>) => void
    /** Called once during editor.destroy(). */
    onDestroy?: (ctx: ExtensionContext<Storage>) => void
}

// ─────────────────────────────────────────────────────
// Branded extension type
// ─────────────────────────────────────────────────────

/**
 * A native Lexical extension carrying Typix metadata via the TYPIX_META
 * symbol. The `__typixBrand` field is a phantom that never exists at
 * runtime — it only carries the Storage and Commands type parameters
 * for inference.
 *
 * Any `TypixExtension` IS-A `AnyLexicalExtension` — pure-Lexical
 * consumers can use it without Typix.
 */
export type TypixExtension<
    Storage = unknown,
    Commands extends CommandFactoryMap = CommandFactoryMap,
> = AnyLexicalExtension & {
    readonly __typixBrand?: {
        storage: Storage
        commands: Commands
    }
}

/**
 * Internal metadata stamped on an extension via TYPIX_META. Used by the
 * registry — extension authors don't touch this directly.
 */
export interface InternalTypixMeta {
    name: string
    commands?: () => CommandFactoryMap
    shortcuts: TypixShortcut[]
    storage?: () => unknown
    onCreate?: (ctx: ExtensionContext<unknown>) => void
    onDestroy?: (ctx: ExtensionContext<unknown>) => void
}

// ─────────────────────────────────────────────────────
// Type helpers exposed to consumers
// ─────────────────────────────────────────────────────

/** Extract the storage type from a TypixExtension. */
export type ExtensionStorage<E extends TypixExtension> =
    E extends TypixExtension<infer S, CommandFactoryMap> ? S : never

/** Extract the commands record from a TypixExtension. */
export type ExtensionCommands<E extends TypixExtension> =
    E extends TypixExtension<unknown, infer C> ? C : never
