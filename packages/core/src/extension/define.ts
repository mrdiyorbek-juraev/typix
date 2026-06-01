import type { AnyLexicalExtension } from 'lexical'
import type {
    CommandFactoryMap,
    InternalTypixMeta,
    TypixExtension,
    TypixMetaConfig,
} from '../types'

// ─────────────────────────────────────────────────────
// Internal symbol used to attach Typix metadata to an
// extension object without colliding with Lexical fields.
// `Symbol.for` ensures consistency across module instances.
// ─────────────────────────────────────────────────────

export const TYPIX_META = Symbol.for('typix.meta')

/**
 * Attach Typix metadata to a native Lexical extension.
 *
 * The extension stays a real Lexical extension — anyone in the Lexical
 * ecosystem can use it as-is. This call just stamps Typix-specific
 * metadata (commands, shortcuts, storage, lifecycle hooks) onto the
 * object via the TYPIX_META symbol.
 *
 * Mutates the input AND returns it with a branded type so consumers
 * get typed `editor.storage(ext)` and `editor.commands(ext)` access.
 *
 * @example
 * ```ts
 * import { defineExtension, FORMAT_TEXT_COMMAND } from 'lexical'
 * import { withTypixMeta } from '@typix-editor/core'
 *
 * // Pure Lexical first — usable in any Lexical project
 * export const BoldExtension = withTypixMeta(
 *   defineExtension({
 *     name: 'bold',
 *     register: (editor) => () => {},
 *   }),
 *   {
 *     commands: () => ({
 *       toggleBold: () => (e) => e.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
 *     }),
 *     shortcuts: [{ key: 'b', modifiers: ['mod'], command: 'toggleBold' }],
 *   },
 * )
 *
 * declare module '@typix-editor/core' {
 *   interface TypixCommands<R> {
 *     toggleBold(): R
 *   }
 * }
 * ```
 */
export function withTypixMeta<
    E extends AnyLexicalExtension,
    Storage = void,
    Commands extends CommandFactoryMap = Record<never, never>,
>(
    extension: E,
    meta: TypixMetaConfig<Storage, Commands>,
): E & TypixExtension<Storage, Commands> {
    const name = readExtensionName(extension)

    const internal: InternalTypixMeta = {
        name,
        commands: meta.commands as (() => CommandFactoryMap) | undefined,
        shortcuts: meta.shortcuts ?? [],
        storage: meta.storage as (() => unknown) | undefined,
        onCreate: meta.onCreate as ((ctx: any) => void) | undefined,
        onDestroy: meta.onDestroy as ((ctx: any) => void) | undefined,
    }

    Object.defineProperty(extension, TYPIX_META, {
        value: internal,
        enumerable: false,
        writable: false,
        configurable: false,
    })

    return extension as E & TypixExtension<Storage, Commands>
}

/**
 * Read Typix metadata from a Lexical extension if it has been stamped via
 * `withTypixMeta`. Returns undefined for plain Lexical extensions.
 */
export function getTypixExtensionMeta(
    extension: AnyLexicalExtension,
): InternalTypixMeta | undefined {
    return (extension as unknown as Record<symbol, InternalTypixMeta | undefined>)[
        TYPIX_META
    ]
}

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

/**
 * Read the `name` field off a Lexical extension. Falls back to a stable
 * placeholder so registry warnings still make sense if a caller passes
 * an extension that somehow lacks one.
 */
function readExtensionName(extension: AnyLexicalExtension): string {
    const raw = (extension as unknown as { name?: unknown }).name
    return typeof raw === 'string' ? raw : '<anonymous>'
}
