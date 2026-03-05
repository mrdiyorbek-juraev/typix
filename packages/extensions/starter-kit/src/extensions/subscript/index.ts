import {
    defineExtension,
    safeCast,
    FORMAT_TEXT_COMMAND,
    type LexicalEditor,
} from 'lexical'
import { defineTypixExtension, type TypixExtensionConfig } from '@typix-editor/core'
import { namedSignals } from '@lexical/extension'

export interface SubscriptConfig extends TypixExtensionConfig {
    disabled?: boolean
}

/**
 * SubscriptExtension — toggles subscript formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [SubscriptExtension()] })
 *
 * editor.chain().toggleSubscript().run()
 * ```
 */
export const SubscriptExtension = (userConfig: Partial<SubscriptConfig> = {}) => {
    const resolvedConfig: SubscriptConfig = { ...userConfig }
    const lexicalExt = defineExtension({
        name: '@typix/subscript',
        config: safeCast<SubscriptConfig>(resolvedConfig),
        mergeConfig(a: SubscriptConfig, b: Partial<SubscriptConfig>): SubscriptConfig {
            return { ...a, ...b }
        },
        build(_editor: LexicalEditor, config: SubscriptConfig) {
            return namedSignals(config)
        },
    })

    return defineTypixExtension<SubscriptConfig>({
        name: 'subscript',
        typix: lexicalExt,
        config: resolvedConfig,
        commands: {
            toggleSubscript: (resolvedConfig) => (ctx) => {
                if (resolvedConfig.disabled) return false
                ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
                return true
            },
        },
    })
}
