// ─────────────────────────────────────────────────────
// @typix-editor/core/meta — LEGACY MODULE
// ─────────────────────────────────────────────────────
//
// Everything here is the legacy metadata API. It is re-exported
// from `src/extension/compat.ts` so existing consumers keep
// working unchanged.
//
// Prefer the pattern `withTypixMeta(defineExtension({...}), {...})`
// and the typed `editor.storage(ext)` / `editor.commands(ext)` accessors.
// The exports below will be removed in a future major.

export {
    registerTypixMeta,
    getTypixMeta,
    resolveTypixMeta,
    mergeTypixMeta,
    typixExtension,
    registerExtensionOutput,
    getExtensionOutput,
} from '../extension/compat'
export type { TypixCommandMap, TypixMeta } from '../extension/compat'

// TypixShortcut now lives with the rest of the public types.
export type { TypixShortcut } from '../types'
