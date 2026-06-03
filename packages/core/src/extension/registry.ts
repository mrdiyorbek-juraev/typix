import type {
    AnyLexicalExtension,
    AnyLexicalExtensionArgument,
} from 'lexical'
import type {
    ExtensionContext,
    InternalTypixMeta,
    TypixShortcut,
} from '../types'
import { getTypixExtensionMeta } from './define'

type CommandFactory = (...args: unknown[]) => (...args: unknown[]) => boolean

/**
 * Registry that tracks every Lexical extension passed to createTypix
 * along with its Typix metadata (commands, shortcuts, storage, lifecycle).
 */
export class ExtensionRegistry {
    private extensions: AnyLexicalExtension[] = []
    private commandFactories = new Map<string, CommandFactory>()
    private shortcuts: TypixShortcut[] = []
    private lifecycleMetas: Array<{
        ext: AnyLexicalExtension
        meta: InternalTypixMeta
    }> = []

    /**
     * Register an extension. Accepts both the bare extension and the tuple
     * form returned by `configExtension(Ext, {...})` — in the tuple case
     * the metadata lookup uses the base extension at index [0].
     */
    register(input: AnyLexicalExtensionArgument): void {
        const extension: AnyLexicalExtension = Array.isArray(input)
            ? (input[0] as AnyLexicalExtension)
            : input
        this.extensions.push(extension)

        const meta = getTypixExtensionMeta(extension)
        if (!meta) return

        if (meta.commands) {
            const factory = meta.commands as () => Record<string, CommandFactory>
            let cached: Record<string, CommandFactory> | undefined
            const getRecord = () => {
                if (!cached) cached = factory()
                return cached
            }
            // Eagerly enumerate keys so hasCommand/getCommandFactory
            // see them without instantiating the record twice.
            const sample = getRecord()
            for (const name of Object.keys(sample)) {
                if (this.commandFactories.has(name)) {
                    console.warn(`[Typix] Command "${name}" already registered.`)
                    continue
                }
                this.commandFactories.set(name, (...args: unknown[]) =>
                    getRecord()[name]!(...args),
                )
            }
        }
        if (meta.shortcuts.length) {
            this.shortcuts.push(...meta.shortcuts)
        }
        if (meta.onCreate || meta.onDestroy || meta.storage) {
            this.lifecycleMetas.push({ ext: extension, meta })
        }
    }

    // ── Lookup ──────────────────────────────────────

    /** Typed command factory lookup. */
    getCommandFactory(name: string): CommandFactory | undefined {
        return this.commandFactories.get(name)
    }

    /** True if this command name is registered. */
    hasCommand(name: string): boolean {
        return this.commandFactories.has(name)
    }

    getAllExtensions(): AnyLexicalExtension[] {
        return [...this.extensions]
    }

    getAllShortcuts(): TypixShortcut[] {
        return [...this.shortcuts]
    }

    /** Iterate extensions that registered lifecycle hooks. */
    getLifecycleMetas(): ReadonlyArray<{
        ext: AnyLexicalExtension
        meta: InternalTypixMeta
    }> {
        return this.lifecycleMetas
    }
}

// Re-export for consumers who still import ExtensionContext from registry
export type { ExtensionContext }
