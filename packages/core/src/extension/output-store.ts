import type { AnyLexicalExtension, LexicalEditor } from 'lexical'

// ─────────────────────────────────────────────────────
// Per-Lexical-editor extension output store
// ─────────────────────────────────────────────────────
//
// Solves a different problem than `editor.storage(ext)`:
//
//   storage()                 → typed value owned by TypixEditor,
//                               created at TypixEditor construction time.
//   registerExtensionOutput() → arbitrary object keyed by `LexicalEditor`,
//                               populated from inside Lexical's
//                               `defineExtension({ build })` hook so signals
//                               and other Lexical-state-machine outputs are
//                               readable from sibling packages (e.g. UI
//                               adapters) that only have a `LexicalEditor`
//                               reference.
//
// Both APIs are first-class. Use `storage` for typed Typix state, this for
// cross-package access to Lexical-build outputs.

const outputStore = new WeakMap<
    LexicalEditor,
    WeakMap<AnyLexicalExtension, unknown>
>()

export function registerExtensionOutput<T>(
    editor: LexicalEditor,
    extension: AnyLexicalExtension,
    output: T,
): void {
    let perEditor = outputStore.get(editor)
    if (!perEditor) {
        perEditor = new WeakMap()
        outputStore.set(editor, perEditor)
    }
    perEditor.set(extension, output)
}

export function getExtensionOutput<T>(
    editor: LexicalEditor,
    extension: AnyLexicalExtension,
): T | undefined {
    return outputStore.get(editor)?.get(extension) as T | undefined
}
