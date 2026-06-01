import type { LexicalEditor } from 'lexical'
import type {
    BuiltinMarkName,
    CanChainBuilder,
    ChainBuilder,
    SerializedContent,
} from '../../types'
import type { ExtensionRegistry } from '../../extension'
import { executeBuiltinCommand } from '../command'
import { isKnownBuiltinCommand } from './can'

type QueuedStep = {
    name: string
    args: unknown[]
}

// Internal shape — the concrete object backing the Proxy. Kept loose so
// the Proxy can attach typed extension commands via declaration merging.
interface ChainBase {
    run(): boolean
    focus(position?: 'start' | 'end' | 'all'): ChainBuilder
    blur(): ChainBuilder
    setContent(content: SerializedContent | string): ChainBuilder
    clearContent(): ChainBuilder
    undo(): ChainBuilder
    redo(): ChainBuilder
    toggleMark(name: BuiltinMarkName, attrs?: Record<string, unknown>): ChainBuilder
}

interface CanChainBase {
    run(): boolean
    focus(position?: 'start' | 'end' | 'all'): CanChainBuilder
    blur(): CanChainBuilder
    setContent(content: SerializedContent | string): CanChainBuilder
    clearContent(): CanChainBuilder
    undo(): CanChainBuilder
    redo(): CanChainBuilder
    toggleMark(name: BuiltinMarkName, attrs?: Record<string, unknown>): CanChainBuilder
}

/**
 * Creates a chainable command builder.
 *
 * Every method queues a command and returns the proxy, allowing fluent
 * chains. Calling `.run()` executes all queued commands in order and
 * returns `true` if every command succeeded.
 *
 * Built-in methods are typed via `TypixCommands<R>`. Extension authors
 * augment that interface from their own package to add type-safe entries.
 *
 * @example
 * ```ts
 * editor.chain().focus().toggleBold().run()
 * ```
 */
export function createChainBuilder(
    lexicalEditor: LexicalEditor,
    registry: ExtensionRegistry,
): ChainBuilder {
    const queue: QueuedStep[] = []

    // Forward reference so the typed methods can return the proxy.
    let proxy: ChainBuilder

    const builder: ChainBase = {
        run(): boolean {
            let allSucceeded = true
            for (const step of queue) {
                const success = dispatchCommand(lexicalEditor, registry, step.name, step.args)
                if (!success) allSucceeded = false
            }
            queue.length = 0
            return allSucceeded
        },
        focus(position = 'end') {
            queue.push({ name: 'focus', args: [position] })
            return proxy
        },
        blur() {
            queue.push({ name: 'blur', args: [] })
            return proxy
        },
        setContent(content) {
            queue.push({ name: 'setContent', args: [content] })
            return proxy
        },
        clearContent() {
            queue.push({ name: 'clearContent', args: [] })
            return proxy
        },
        undo() {
            queue.push({ name: 'undo', args: [] })
            return proxy
        },
        redo() {
            queue.push({ name: 'redo', args: [] })
            return proxy
        },
        toggleMark(name, attrs) {
            queue.push({ name: 'toggleMark', args: [name, attrs] })
            return proxy
        },
    }

    proxy = new Proxy(builder, {
        get(target, prop: string) {
            if (prop in target) {
                return (target as unknown as Record<string, unknown>)[prop]
            }
            if (typeof prop === 'string') {
                return (...args: unknown[]) => {
                    queue.push({ name: prop, args })
                    return proxy
                }
            }
            return undefined
        },
    }) as unknown as ChainBuilder

    return proxy
}

/**
 * Dispatch a single named command against the editor.
 *
 * Resolution order:
 *   1. Typed command factory registered via withTypixMeta(..., { commands })
 *   2. Legacy Lexical command registered via registerTypixMeta.commands
 *   3. Built-in commands (focus, blur, setContent, clearContent,
 *      toggleMark, undo, redo)
 */
function dispatchCommand(
    editor: LexicalEditor,
    registry: ExtensionRegistry,
    name: string,
    args: unknown[],
): boolean {
    // Typed command factory
    const factory = registry.getCommandFactory(name)
    if (factory) {
        try {
            const commandFn = factory(...args)
            return commandFn(editor) !== false
        } catch (err: unknown) {
            console.error(`[Typix] Error in v5 command "${name}":`, err)
            return false
        }
    }

    // Legacy: Lexical command from registerTypixMeta
    const lexicalCmd = registry.getLexicalCommand(name)
    if (lexicalCmd) {
        try {
            return editor.dispatchCommand(lexicalCmd, args[0])
        } catch (err: unknown) {
            console.error(`[Typix] Error dispatching "${name}":`, err)
            return false
        }
    }

    // Built-in fallback
    return executeBuiltinCommand(editor, name, args)
}

// ─────────────────────────────────────────────────────
// Can chain builder — checks command availability without executing
// ─────────────────────────────────────────────────────

/**
 * Creates a chainable command builder that checks whether commands
 * **can** run without actually executing them.
 *
 * A command "can run" if it is a registered command factory, a registered
 * legacy Lexical command, or a known built-in.
 *
 * @example
 * ```ts
 * editor.can().toggleBold().run()   // true if a bold extension registered
 * editor.can().nonexistent().run()  // false
 * ```
 */
export function createCanChainBuilder(
    _lexicalEditor: LexicalEditor,
    registry: ExtensionRegistry,
): CanChainBuilder {
    const queue: QueuedStep[] = []

    let proxy: CanChainBuilder

    const builder: CanChainBase = {
        run(): boolean {
            for (const step of queue) {
                if (!canDispatchCommand(registry, step.name, step.args)) {
                    queue.length = 0
                    return false
                }
            }
            queue.length = 0
            return true
        },
        focus(position = 'end') {
            queue.push({ name: 'focus', args: [position] })
            return proxy
        },
        blur() {
            queue.push({ name: 'blur', args: [] })
            return proxy
        },
        setContent(content) {
            queue.push({ name: 'setContent', args: [content] })
            return proxy
        },
        clearContent() {
            queue.push({ name: 'clearContent', args: [] })
            return proxy
        },
        undo() {
            queue.push({ name: 'undo', args: [] })
            return proxy
        },
        redo() {
            queue.push({ name: 'redo', args: [] })
            return proxy
        },
        toggleMark(name, attrs) {
            queue.push({ name: 'toggleMark', args: [name, attrs] })
            return proxy
        },
    }

    proxy = new Proxy(builder, {
        get(target, prop: string) {
            if (prop in target) {
                return (target as unknown as Record<string, unknown>)[prop]
            }
            if (typeof prop === 'string') {
                return (...args: unknown[]) => {
                    queue.push({ name: prop, args })
                    return proxy
                }
            }
            return undefined
        },
    }) as unknown as CanChainBuilder

    return proxy
}

function canDispatchCommand(
    registry: ExtensionRegistry,
    name: string,
    args: unknown[],
): boolean {
    if (registry.hasCommand(name)) return true
    return isKnownBuiltinCommand(name, args)
}
