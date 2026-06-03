// ─────────────────────────────────────────────────────
// @typix-editor/core — extension package barrel
// ─────────────────────────────────────────────────────

import { configExtension } from 'lexical'

// Attach Typix metadata to a Lexical extension.
export {
    withTypixMeta,
    getTypixExtensionMeta,
    TYPIX_META,
} from './define'

// Registry (still public so adapters can introspect):
export { ExtensionRegistry } from './registry'

// Per-LexicalEditor extension output store (cross-package signal sharing).
export {
    registerExtensionOutput,
    getExtensionOutput,
} from './output-store'

// Re-export Lexical's configExtension so consumers don't need
// to import from 'lexical' directly.
export { configExtension }

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
