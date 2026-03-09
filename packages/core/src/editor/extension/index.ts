import type { AnyLexicalExtension, LexicalCommand } from 'lexical'
import type { TypixShortcut } from '../../meta'
import { getTypixMeta } from '../../meta'
import { configExtension } from 'lexical'

/**
 * A registry that tracks all native Lexical extensions and their Typix metadata.
 */
export class ExtensionRegistry {
    private extensions: AnyLexicalExtension[] = []
    private commandMap = new Map<string, LexicalCommand<any>>()
    private shortcuts: TypixShortcut[] = []

    register(extension: AnyLexicalExtension): void {
        this.extensions.push(extension)
        const meta = getTypixMeta(extension)
        if (!meta) return

        if (meta.commands) {
            for (const [name, cmd] of Object.entries(meta.commands)) {
                if (this.commandMap.has(name)) {
                    console.warn(`[Typix] Command "${name}" already registered.`)
                    continue
                }
                this.commandMap.set(name, cmd)
            }
        }

        if (meta.shortcuts) {
            this.shortcuts.push(...meta.shortcuts)
        }
    }

    getLexicalCommand(name: string): LexicalCommand<any> | undefined {
        return this.commandMap.get(name)
    }

    hasCommand(name: string): boolean {
        return this.commandMap.has(name)
    }

    getAllExtensions(): AnyLexicalExtension[] {
        return [...this.extensions]
    }

    getAllShortcuts(): TypixShortcut[] {
        return [...this.shortcuts]
    }
}

export { configExtension }
