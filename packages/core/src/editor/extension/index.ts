import type {
    TypixExtensionDefinition,
    TypixExtensionConfig,
    CommandFunction,
    CommandHandler,
    ShortcutDefinition,
    AnyLexicalExtension,
} from '../../types';
import { configExtension } from 'lexical';

/**
 * Define a Typix extension.
 *
 * A Typix extension wraps a Lexical extension with higher-level metadata:
 * commands, shortcuts, and typed config — forming the core composability
 * primitive of the Typix API.
 *
 * @example
 * ```ts
 * export const BoldExtension = () =>
 *   defineTypixExtension({
 *     name: 'bold',
 *     lexical: defineExtension({
 *       name: '@typix/bold',
 *       register: registerBold,
 *     }),
 *     commands: {
 *       toggleBold: () => ({ editor }) => {
 *         editor.update(() => { ... })
 *         return true
 *       },
 *     },
 *     shortcuts: [
 *       { key: 'b', modifiers: ['mod'], command: 'toggleBold' }
 *     ],
 *   })
 * ```
 */
export function defineTypixExtension<
    TConfig extends TypixExtensionConfig = TypixExtensionConfig,
>(definition: TypixExtensionDefinition<TConfig>): TypixExtensionDefinition<TConfig> {
    return definition
}

/**
 * Merge two configs with shallow merge (arrays are replaced, not concatenated).
 * Use `mergeTypixConfig` for deep merge or array concat.
 */
export function mergeTypixConfig<T extends TypixExtensionConfig>(
    base: T,
    override: Partial<T>,
): T {
    return { ...base, ...override }
}

/**
 * A registry that tracks all extensions registered with an editor.
 */
export class ExtensionRegistry {
    private extensions: Map<string, TypixExtensionDefinition> = new Map()
    // Stores pre-bound CommandHandlers (config already applied at registration)
    private commands: Map<string, CommandHandler> = new Map()
    private shortcuts: ShortcutDefinition[] = []

    register(extension: TypixExtensionDefinition): void {
        if (this.extensions.has(extension.name)) {
            console.warn(
                `[Typix] Extension "${extension.name}" is already registered. Skipping duplicate.`,
            )
            return
        }

        this.extensions.set(extension.name, extension)

        if (extension.commands) {
            const resolvedConfig = extension.config ?? {}
            for (const [commandName, fn] of Object.entries(extension.commands)) {
                if (this.commands.has(commandName)) {
                    console.warn(
                        `[Typix] Command "${commandName}" is already registered by another extension.`,
                    )
                    continue
                }
                // Pre-bind the extension's resolved config so commands always
                // receive the correct config (e.g. heading.levels) at call time
                this.commands.set(commandName, (fn as CommandFunction)(resolvedConfig))
            }
        }

        if (extension.shortcuts) {
            this.shortcuts.push(...extension.shortcuts)
        }
    }

    getExtension<T extends TypixExtensionDefinition>(name: string): T | undefined {
        return this.extensions.get(name) as T | undefined
    }

    hasExtension(name: string): boolean {
        return this.extensions.has(name)
    }

    getCommand(name: string): CommandHandler | undefined {
        return this.commands.get(name)
    }

    getAllCommands(): Map<string, CommandHandler> {
        return new Map(this.commands)
    }

    getAllExtensions(): TypixExtensionDefinition[] {
        return Array.from(this.extensions.values())
    }

    getAllShortcuts(): ShortcutDefinition[] {
        return [...this.shortcuts]
    }

    getLexicalExtensions(): AnyLexicalExtension[] {
        return this.getAllExtensions().map((ext) => ext.typix)
    }
}

export { configExtension }