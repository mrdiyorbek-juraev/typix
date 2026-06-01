import type {
    AnyLexicalExtension,
    AnyLexicalExtensionArgument,
    LexicalCommand,
} from 'lexical'
import type {
    ExtensionContext,
    InternalTypixMeta,
    TypixShortcut,
} from '../types'
import { getLegacyTypixMeta } from './compat'
import { getTypixExtensionMeta } from './define'

type CommandFactory = (...args: unknown[]) => (...args: unknown[]) => boolean

/**
 * Registry that tracks every Lexical extension passed to createTypix
 * along with its Typix metadata.
 *
 * Dual-reads new-style metadata (TYPIX_META symbol) and legacy metadata
 * (registerTypixMeta WeakMap) so old and new extensions coexist.
 */
export class ExtensionRegistry {
    private extensions: AnyLexicalExtension[] = []
    private lexicalCommandMap = new Map<string, LexicalCommand<any>>()
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

        // ── Preferred path: metadata stamped via TYPIX_META symbol ──
        const v5 = getTypixExtensionMeta(extension)
        if (v5) {
            if (v5.commands) {
                const factory = v5.commands as () => Record<string, CommandFactory>
                let cached: Record<string, CommandFactory> | undefined
                const getRecord = () => {
                    if (!cached) cached = factory()
                    return cached
                }
                // Eagerly enumerate keys so hasCommand/getCommandFactory
                // see them without instantiating the record twice.
                const sample = getRecord()
                for (const name of Object.keys(sample)) {
                    if (this.hasCommand(name)) {
                        console.warn(`[Typix] Command "${name}" already registered.`)
                        continue
                    }
                    this.commandFactories.set(name, (...args: unknown[]) =>
                        getRecord()[name]!(...args),
                    )
                }
            }
            if (v5.shortcuts.length) {
                this.shortcuts.push(...v5.shortcuts)
            }
            if (v5.onCreate || v5.onDestroy || v5.storage) {
                this.lifecycleMetas.push({ ext: extension, meta: v5 })
            }
            return
        }

        // ── Legacy path: registerTypixMeta WeakMap ──
        const v4 = getLegacyTypixMeta(extension)
        if (!v4) return

        if (v4.commands) {
            for (const [name, cmd] of Object.entries(v4.commands)) {
                if (this.hasCommand(name)) {
                    console.warn(`[Typix] Command "${name}" already registered.`)
                    continue
                }
                this.lexicalCommandMap.set(name, cmd)
            }
        }
        if (v4.shortcuts) {
            this.shortcuts.push(...v4.shortcuts)
        }
    }

    // ── Lookup ──────────────────────────────────────

    /** Typed command factory lookup. */
    getCommandFactory(name: string): CommandFactory | undefined {
        return this.commandFactories.get(name)
    }

    /** Lexical command lookup (legacy registerTypixMeta path). */
    getLexicalCommand(name: string): LexicalCommand<any> | undefined {
        return this.lexicalCommandMap.get(name)
    }

    /** True if this command name is registered via either path. */
    hasCommand(name: string): boolean {
        return (
            this.commandFactories.has(name) || this.lexicalCommandMap.has(name)
        )
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
