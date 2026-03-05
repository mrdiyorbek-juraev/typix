import type { LexicalEditor } from 'lexical'
import type { ChainBuilder, BuiltinCommands, SerializedContent } from '../../types'
import type { ExtensionRegistry } from '../extension'
import { executeBuiltinCommand } from '../command'

type QueuedStep = {
    name: string
    args: unknown[]
}

/**
 * Creates a chainable command builder.
 *
 * Every method queues a command and returns `this`, allowing fluent chains.
 * Calling `.run()` executes all queued commands in order and returns `true`
 * if every command succeeded.
 *
 * @example
 * ```ts
 * editor.chain()
 *   .focus()
 *   .toggleBold()
 *   .run()
 * ```
 */
export function createChainBuilder(
    lexicalEditor: LexicalEditor,
    registry: ExtensionRegistry,
): ChainBuilder {
    const queue: QueuedStep[] = []

    // Declare proxy reference so known methods can return it
    let proxy: ChainBuilder

    const builder: ChainBuilder = {
        run(): boolean {
            let allSucceeded = true
            for (const step of queue) {
                const success = dispatchCommand(lexicalEditor, registry, step.name, step.args)
                if (!success) {
                    allSucceeded = false
                }
            }
            queue.length = 0
            return allSucceeded
        },

        focus(position = 'end'): ChainBuilder {
            queue.push({ name: 'focus', args: [position] })
            return proxy
        },

        blur(): ChainBuilder {
            queue.push({ name: 'blur', args: [] })
            return proxy
        },

        setContent(content: SerializedContent | string): ChainBuilder {
            queue.push({ name: 'setContent', args: [content] })
            return proxy
        },

        clearContent(): ChainBuilder {
            queue.push({ name: 'clearContent', args: [] })
            return proxy
        },

        toggleMark(name: string, attrs?: Record<string, unknown>): ChainBuilder {
            queue.push({ name: 'toggleMark', args: [name, attrs] })
            return proxy
        },

        toggleBlock(name: string, attrs?: Record<string, unknown>): ChainBuilder {
            queue.push({ name: 'toggleBlock', args: [name, attrs] })
            return proxy
        },
    }

    // Proxy: intercept any unknown method call and treat it as a registered command
    proxy = new Proxy(builder, {
        get(target, prop: string) {
            // Return known chain methods directly
            if (prop in target) {
                return target[prop as keyof ChainBuilder]
            }

            // Treat unknown props as dynamic commands from extensions
            if (typeof prop === 'string') {
                return (...args: unknown[]) => {
                    queue.push({ name: prop, args })
                    return proxy
                }
            }

            return undefined
        },
    })

    return proxy
}

/**
 * Dispatch a single named command against the editor.
 * Checks extension commands first, then falls back to built-in commands.
 */
function dispatchCommand(
    editor: LexicalEditor,
    registry: ExtensionRegistry,
    name: string,
    args: unknown[],
): boolean {
    // Try extension-registered commands first (config is pre-bound at registration)
    const handler = registry.getCommand(name)
    if (handler) {
        try {
            const builtins = makeBuiltinCommands(editor)
            const attrs = args[0] as Record<string, unknown> | undefined
            const result = handler({ editor, commands: builtins }, attrs)
            return result !== false
        } catch (err) {
            console.error(`[Typix] Error executing command "${name}":`, err)
            return false
        } 
    }

    // Fall back to built-in commands
    return executeBuiltinCommand(editor, name, args)
}

function makeBuiltinCommands(editor: LexicalEditor): BuiltinCommands {
    return {
        toggleMark: (type: string, attrs?: Record<string, unknown>) =>
            executeBuiltinCommand(editor, 'toggleMark', [type, attrs]),
        toggleBlock: (type: string, attrs?: Record<string, unknown>) =>
            executeBuiltinCommand(editor, 'toggleBlock', [type, attrs]),
        setContent: (content: SerializedContent) =>
            executeBuiltinCommand(editor, 'setContent', [content]),
        clearContent: () => executeBuiltinCommand(editor, 'clearContent', []),
        focus: () => executeBuiltinCommand(editor, 'focus', []),
        blur: () => executeBuiltinCommand(editor, 'blur', []),
    }
}