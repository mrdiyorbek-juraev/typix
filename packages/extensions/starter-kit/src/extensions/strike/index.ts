import {
    defineExtension,
    safeCast,
    FORMAT_TEXT_COMMAND,
    type LexicalEditor,
} from 'lexical'
import { defineTypixExtension, type TypixExtensionConfig } from '@typix-editor/core'
import { namedSignals } from '@lexical/extension'

export interface StrikeConfig extends TypixExtensionConfig {
    disabled?: boolean
}

/**
 * StrikeExtension — toggles strikethrough formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [StrikeExtension()] })
 *
 * editor.chain().toggleStrike().run()
 * ```
 */
export const StrikeExtension = (userConfig: Partial<StrikeConfig> = {}) => {
    const resolvedConfig: StrikeConfig = { ...userConfig }
    const lexicalExt = defineExtension({
        name: '@typix/strike',
        config: safeCast<StrikeConfig>(resolvedConfig),
        mergeConfig(a: StrikeConfig, b: Partial<StrikeConfig>): StrikeConfig {
            return { ...a, ...b }
        },
        build(_editor: LexicalEditor, config: StrikeConfig) {
            return namedSignals(config)
        },
    })

    return defineTypixExtension<StrikeConfig>({
        name: 'strike',
        typix: lexicalExt,
        config: resolvedConfig,
        commands: {
            toggleStrike: (resolvedConfig) => (ctx) => {
                if (resolvedConfig.disabled) return false
                ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                return true
            },
        },
        shortcuts: [
            { key: 's', modifiers: ['mod', 'shift'], command: 'toggleStrike' },
        ],
    })
}
