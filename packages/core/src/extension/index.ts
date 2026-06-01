// ─────────────────────────────────────────────────────
// @typix-editor/core — extension package barrel
// ─────────────────────────────────────────────────────

import { configExtension } from 'lexical'

// Preferred API: bare Lexical extensions + side-attached Typix metadata
export {
    withTypixMeta,
    getTypixExtensionMeta,
    TYPIX_META,
} from './define'

// Registry (still public so adapters can introspect):
export { ExtensionRegistry } from './registry'

// Re-export Lexical's configExtension so consumers don't need
// to import from 'lexical' directly.
export { configExtension }

// Legacy compatibility shim (deprecated):
export {
    registerTypixMeta,
    getTypixMeta,
    resolveTypixMeta,
    mergeTypixMeta,
    typixExtension,
    registerExtensionOutput,
    getExtensionOutput,
} from './compat'
export type { TypixCommandMap, TypixMeta } from './compat'

// Extension types live in types/ — re-export for convenience so consumers
// can import everything from '@typix-editor/core/extension' if they prefer.
export type {
    TypixExtension,
    TypixMetaConfig,
    InternalTypixMeta,
    ExtensionContext,
    ExtensionStorage,
    ExtensionCommands,
} from '../types'
