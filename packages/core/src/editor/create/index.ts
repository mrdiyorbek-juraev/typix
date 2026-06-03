import { buildEditorFromExtensions } from '@lexical/extension'
import {
    defineExtension,
    type AnyLexicalExtension,
    type AnyLexicalExtensionArgument,
} from 'lexical'
import type { CreateTypixOptions, TypixEditorInstance } from '../../types'
import { ExtensionRegistry } from '../../extension'
import { setEditorContent } from '../command'
import { TypixEditor } from '../editor'

/**
 * Create a new Typix editor instance.
 *
 * This is the primary entry point for building a Typix editor. It:
 * 1. Emits `beforeCreate` (synchronously)
 * 2. Walks the extension dependency graph so nested extensions register too
 * 3. Builds a Lexical editor from all provided extensions
 * 4. Registers commands, shortcuts, and lifecycle hooks
 * 5. Emits `create` (after construction, before initial content)
 * 6. Returns a `TypixEditorInstance` ready to be mounted
 *
 * The returned instance is framework-agnostic. Mount it using a
 * framework adapter (`@typix-editor/react`, `@typix-editor/vue`,
 * `@typix-editor/svelte`) or manually via `editor.mount(element)`.
 *
 * @example
 * ```ts
 * import { createTypix } from '@typix-editor/core'
 * import { BoldExtension, HeadingExtension } from '@typix-editor/extensions'
 *
 * const editor = createTypix({
 *   extensions: [BoldExtension, HeadingExtension],
 *   editable: true,
 *   namespace: 'my-editor',
 *   onCreate: ({ editor }) => console.log('editor ready', editor.id),
 * })
 *
 * editor.mount(document.getElementById('editor')!)
 * editor.chain().focus().toggleBold().run()
 * ```
 */
export function createTypix(options: CreateTypixOptions): TypixEditorInstance {
    const {
        extensions = [],
        editable = true,
        namespace = 'typix',
        theme = {},
        content,
        onError = (err) => {
            throw err
        },
        onBeforeCreate,
        onCreate,
    } = options

    // Inline hook: fires before anything else.
    onBeforeCreate?.({ options })

    // 1. Register every extension reachable via the dependency graph.
    //    Aggregator extensions like StarterKit list sub-extensions as
    //    Lexical dependencies — walking the graph means their commands,
    //    shortcuts, storage, and lifecycle hooks are picked up automatically
    //    without a separate "merge metadata" step.
    const registry = new ExtensionRegistry()
    const seen = new WeakSet<AnyLexicalExtension>()
    const registerRecursively = (input: AnyLexicalExtensionArgument): void => {
        const base: AnyLexicalExtension = Array.isArray(input)
            ? (input[0] as AnyLexicalExtension)
            : input
        if (seen.has(base)) return
        seen.add(base)
        registry.register(input)
        const deps = (base as { dependencies?: AnyLexicalExtensionArgument[] })
            .dependencies
        if (deps) {
            for (const dep of deps) registerRecursively(dep)
        }
    }
    for (const ext of extensions) {
        registerRecursively(ext)
    }

    // 2. Build the root Lexical extension that aggregates everything
    const rootExtension = defineExtension({
        name: `@typix/root/${namespace}`,
        namespace,
        editable,
        theme,
        onError,
        dependencies: extensions,
    })

    // 3. Build the Lexical editor
    const lexicalEditor = buildEditorFromExtensions(rootExtension)

    // 4. Wrap in TypixEditor instance
    const typixEditor = new TypixEditor(
        lexicalEditor,
        registry,
        namespace,
        () => lexicalEditor.dispose(),
    )

    // 5. Attach inline `onCreate` listener BEFORE emitting `create` so the
    //    inline hook receives the event on this very call.
    if (onCreate) typixEditor.on('create', onCreate)

    // 6. Emit `create` (runs extension onCreate hooks too)
    typixEditor._emitCreate()

    // 7. Apply initial content if provided
    if (content) {
        setEditorContent(lexicalEditor, content)
    }

    return typixEditor
}
