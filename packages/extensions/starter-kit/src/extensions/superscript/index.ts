import {
    defineExtension,
    safeCast,
    FORMAT_TEXT_COMMAND,
    type LexicalEditor,
} from 'lexical'
import { defineTypixExtension, type TypixExtensionConfig } from '@typix-editor/core'
import { namedSignals } from '@lexical/extension'

export interface SuperscriptConfig extends TypixExtensionConfig {
    disabled?: boolean
}

/**
 * SuperscriptExtension — toggles superscript formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [SuperscriptExtension()] })
 *
 * editor.chain().toggleSuperscript().run()
 * ```
 */
export const SuperscriptExtension = (userConfig: Partial<SuperscriptConfig> = {}) => {
    const resolvedConfig: SuperscriptConfig = { ...userConfig }
    const lexicalExt = defineExtension({
        name: '@typix/superscript',
        config: safeCast<SuperscriptConfig>(resolvedConfig),
        mergeConfig(a: SuperscriptConfig, b: Partial<SuperscriptConfig>): SuperscriptConfig {
            return { ...a, ...b }
        },
        build(_editor: LexicalEditor, config: SuperscriptConfig) {
            return namedSignals(config)
        },
    })

    return defineTypixExtension<SuperscriptConfig>({
        name: 'superscript',
        typix: lexicalExt,
        config: resolvedConfig,
        commands: {
            toggleSuperscript: (resolvedConfig) => (ctx) => {
                if (resolvedConfig.disabled) return false
                ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
                return true
            },
        },
    })
}
