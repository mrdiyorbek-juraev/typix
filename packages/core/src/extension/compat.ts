import type {
    AnyLexicalExtension,
    LexicalCommand,
    LexicalEditor,
} from 'lexical'
import type { TypixShortcut } from '../types'

// ─────────────────────────────────────────────────────
// Legacy metadata shape — kept identical to packages/core/src/meta
// so existing extensions and tests don't break.
// ─────────────────────────────────────────────────────

/** Maps friendly command names (e.g. "toggleBold") to Lexical commands. */
export interface TypixCommandMap {
    [commandName: string]: LexicalCommand<any>
}

/** Metadata attached to a native Lexical extension for Typix DX features. */
export interface TypixMeta {
    commands?: TypixCommandMap
    shortcuts?: TypixShortcut[]
}

// ─────────────────────────────────────────────────────
// WeakMap storage (legacy path)
// ─────────────────────────────────────────────────────

const legacyMetaStore = new WeakMap<AnyLexicalExtension, TypixMeta>()

/**
 * @deprecated Use `withTypixMeta(defineExtension({...}), { commands, shortcuts })` instead.
 *
 * Attach Typix metadata to a native Lexical extension. Kept for backward
 * compatibility; will be removed in a future major.
 */
export function registerTypixMeta(
    extension: AnyLexicalExtension,
    meta: TypixMeta,
): void {
    legacyMetaStore.set(extension, meta)
}

/**
 * @deprecated Use `getTypixExtensionMeta` (internal) or read the
 *   typed `editor.storage(ext)` / `editor.commands(ext)` accessors.
 */
export function getTypixMeta(
    extension: AnyLexicalExtension,
): TypixMeta | undefined {
    return legacyMetaStore.get(extension)
}

/** Internal — used by the registry to read the legacy store. */
export function getLegacyTypixMeta(
    extension: AnyLexicalExtension,
): TypixMeta | undefined {
    return legacyMetaStore.get(extension)
}

/**
 * @deprecated Call sites that pass configExtension tuples should
 *   instead pass the static extension directly.
 *
 * Resolve metadata from an extension OR a configExtension tuple.
 */
export function resolveTypixMeta(
    extOrTuple: AnyLexicalExtension | [AnyLexicalExtension, ...unknown[]],
): TypixMeta | undefined {
    const base = Array.isArray(extOrTuple) ? extOrTuple[0] : extOrTuple
    return legacyMetaStore.get(base)
}

/**
 * @deprecated StarterKit-style composition is handled by the
 *   registry. This helper remains only for legacy code that pre-flattens
 *   metadata before registration.
 */
export function mergeTypixMeta(
    extensions: Array<
        AnyLexicalExtension | [AnyLexicalExtension, ...unknown[]]
    >,
): TypixMeta {
    const commands: TypixCommandMap = {}
    const shortcuts: TypixShortcut[] = []

    for (const ext of extensions) {
        const meta = resolveTypixMeta(ext)
        if (!meta) continue

        if (meta.commands) {
            for (const [name, cmd] of Object.entries(meta.commands)) {
                if (name in commands) {
                    console.warn(
                        `[Typix] Duplicate command name "${name}" during metadata merge.`,
                    )
                    continue
                }
                commands[name] = cmd
            }
        }

        if (meta.shortcuts) {
            shortcuts.push(...meta.shortcuts)
        }
    }

    return { commands, shortcuts }
}

/**
 * @deprecated Use `withTypixMeta(defineExtension({...}), { commands, ... })`.
 *
 * Convenience: define a Lexical extension and attach Typix metadata in
 * one call. The result IS a native Lexical extension — no wrapping.
 */
export function typixExtension<Ext extends AnyLexicalExtension>(
    extension: Ext,
    meta?: TypixMeta,
): Ext {
    if (meta) registerTypixMeta(extension, meta)
    return extension
}

// ─────────────────────────────────────────────────────
// Per-editor output store (legacy)
// ─────────────────────────────────────────────────────

const outputStore = new WeakMap<
    LexicalEditor,
    WeakMap<AnyLexicalExtension, unknown>
>()

/**
 * @deprecated Use `editor.storage(extension)` with extensions defined
 *   via `withTypixMeta(defineExtension({...}), { storage: () => ... })`.
 */
export function registerExtensionOutput<T>(
    editor: LexicalEditor,
    ext: AnyLexicalExtension,
    output: T,
): void {
    if (!outputStore.has(editor)) outputStore.set(editor, new WeakMap())
    outputStore.get(editor)!.set(ext, output)
}

/**
 * @deprecated Use `editor.storage(extension)`.
 */
export function getExtensionOutput<T>(
    editor: LexicalEditor,
    ext: AnyLexicalExtension,
): T | undefined {
    return outputStore.get(editor)?.get(ext) as T | undefined
}
