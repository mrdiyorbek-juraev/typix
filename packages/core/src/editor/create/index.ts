import { buildEditorFromExtensions } from '@lexical/extension'
import { defineExtension } from 'lexical'
import { CreateTypixOptions, TypixEditorInstance } from '../../types'
import { ExtensionRegistry } from '../extension'
import { setEditorContent } from '../command'
import { TypixEditor } from '../editor'


/**
 * Create a new Typix editor instance.
 *
 * This is the primary entry point for building a Typix editor. It:
 * 1. Builds a Lexical editor from all provided extensions
 * 2. Registers commands, shortcuts, and lifecycle hooks
 * 3. Returns a `TypixEditorInstance` ready to be mounted
 *
 * The returned instance is framework-agnostic. Mount it using a
 * framework adapter (`@typix/react`, `@typix/vue`, `@typix/svelte`)
 * or manually via `editor.mount(element)`.
 *
 * @example
 * ```ts
 * import { createTypix } from '@typix/core'
 * import { BoldExtension, ItalicExtension, HeadingExtension } from '@typix/extensions'
 *
 * const editor = createTypix({
 *   extensions: [
 *     BoldExtension(),
 *     ItalicExtension(),
 *     HeadingExtension({ levels: [1, 2, 3] }),
 *   ],
 *   editable: true,
 *   namespace: 'my-editor',
 * })
 *
 * // Mount manually (or use a framework adapter)
 * editor.mount(document.getElementById('editor')!)
 *
 * // Listen to updates
 * editor.on('update', ({ editor }) => {
 *   console.log(editor.getJSON())
 * })
 *
 * // Use the chain API
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
        nodes,
        onError = (err) => { throw err },
    } = options

    // 1. Build extension registry
    const registry = new ExtensionRegistry()
    for (const ext of extensions) {
        registry.register(ext);
    }

    // 2. Build the root Lexical extension that aggregates everything
    const rootExtension = defineExtension({ 
        name: `@typix/root/${namespace}`,
        namespace,
        editable,
        theme,
        onError,
        dependencies: registry.getLexicalExtensions(), 
    })

    // 3. Build the Lexical editor
    const lexicalEditor = buildEditorFromExtensions(rootExtension)

    // 4. Wrap in TypixEditor instance
    const typixEditor = new TypixEditor(lexicalEditor, registry, namespace, () => lexicalEditor.dispose())

    // 5. Apply initial content if provided
    if (content) {
        setEditorContent(lexicalEditor, content)
    }

    return typixEditor
}