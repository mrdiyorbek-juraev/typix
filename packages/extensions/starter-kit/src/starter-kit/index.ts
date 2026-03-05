import { defineExtension } from 'lexical'
import {
    defineTypixExtension,
    type TypixExtensionDefinition,
    type TypixExtensionConfig,
    type CommandFunction,
} from '@typix-editor/core'
import { BoldExtension, type BoldConfig } from '../extensions/bold'
import { ItalicExtension, type ItalicConfig } from '../extensions/italic'
import { UnderlineExtension, type UnderlineConfig } from '../extensions/underline'
import { StrikeExtension, type StrikeConfig } from '../extensions/strike'
import { SubscriptExtension, type SubscriptConfig } from '../extensions/subscript'
import { SuperscriptExtension, type SuperscriptConfig } from '../extensions/superscript'
import { HighlightExtension, type HighlightConfig } from '../extensions/highlight'
import { HeadingExtension, type HeadingConfig } from '../extensions/heading'
import { BlockquoteExtension, type BlockquoteConfig } from '../extensions/blockquote'
import { ListExtension, type ListConfig } from '../extensions/list'
import { CodeExtension, type CodeConfig } from '../extensions/code'
import { AlignmentExtension, type AlignmentConfig } from '../extensions/alignment'
import { LinkExtension, type LinkConfig } from '../extensions/link'
import { HistoryExtension, type HistoryConfig } from '../extensions/history'
import { AutoLinkExtension, type AutoLinkConfig } from '../extensions/auto-link'
import { DragDropPasteExtension, type DragDropPasteConfig } from '../extensions/drag-drop-paste'

export interface StarterKitOptions extends TypixExtensionConfig {
    bold?:        false | Partial<BoldConfig>
    italic?:      false | Partial<ItalicConfig>
    underline?:   false | Partial<UnderlineConfig>
    strike?:      false | Partial<StrikeConfig>
    subscript?:   false | Partial<SubscriptConfig>
    superscript?: false | Partial<SuperscriptConfig>
    highlight?:   false | Partial<HighlightConfig>
    heading?:     false | Partial<HeadingConfig>
    blockquote?:  false | Partial<BlockquoteConfig>
    list?:        false | Partial<ListConfig>
    code?:        false | Partial<CodeConfig>
    alignment?:   false | Partial<AlignmentConfig>
    link?:        false | Partial<LinkConfig>
    history?:     false | Partial<HistoryConfig>
    autoLink?:      false | Partial<AutoLinkConfig>
    dragDropPaste?: false | Partial<DragDropPasteConfig>
}

/**
 * StarterKit — a batteries-included bundle of the most common Typix extensions,
 * returned as a single `TypixExtensionDefinition`.
 *
 * Pass `false` to disable an extension, or an options object to configure it.
 *
 * @example
 * ```ts
 * // All defaults
 * extensions={[StarterKit()]}
 *
 * // Custom heading levels, no subscript/superscript
 * extensions={[StarterKit({
 *   heading:     { levels: [1, 2, 3] },
 *   subscript:   false,
 *   superscript: false,
 * })]}
 * ```
 */
export const StarterKit = (options: StarterKitOptions = {}): TypixExtensionDefinition<StarterKitOptions> => {
    // Build enabled sub-extensions
    const subExts: TypixExtensionDefinition<any>[] = []

    if (options.bold        !== false) subExts.push(BoldExtension(options.bold ?? {}))
    if (options.italic      !== false) subExts.push(ItalicExtension(options.italic ?? {}))
    if (options.underline   !== false) subExts.push(UnderlineExtension(options.underline ?? {}))
    if (options.strike      !== false) subExts.push(StrikeExtension(options.strike ?? {}))
    if (options.subscript   !== false) subExts.push(SubscriptExtension(options.subscript ?? {}))
    if (options.superscript !== false) subExts.push(SuperscriptExtension(options.superscript ?? {}))
    if (options.highlight   !== false) subExts.push(HighlightExtension(options.highlight ?? {}))
    if (options.heading     !== false) subExts.push(HeadingExtension(options.heading ?? {}))
    if (options.blockquote  !== false) subExts.push(BlockquoteExtension(options.blockquote ?? {}))
    if (options.list        !== false) subExts.push(ListExtension(options.list ?? {}))
    if (options.code        !== false) subExts.push(CodeExtension(options.code ?? {}))
    if (options.alignment   !== false) subExts.push(AlignmentExtension(options.alignment ?? {}))
    if (options.link          !== false) subExts.push(LinkExtension(options.link ?? {}))
    if (options.history       !== false) subExts.push(HistoryExtension(options.history ?? {}))
    if (options.autoLink      !== false) subExts.push(AutoLinkExtension(options.autoLink ?? {}))
    if (options.dragDropPaste !== false) subExts.push(DragDropPasteExtension(options.dragDropPaste ?? {}))

    // Compose all Lexical extensions into one
    const typix = defineExtension({
        name: '@typix/starter-kit',
        dependencies: subExts.map((e) => e.typix),
    })

    // Merge commands — pre-bind each with its own sub-extension config,
    // then wrap to accept StarterKitOptions (which is ignored at call time)
    const commands: Record<string, CommandFunction<StarterKitOptions>> = {}
    for (const ext of subExts) {
        if (ext.commands) {
            const extConfig = (ext.config ?? {}) as TypixExtensionConfig
            for (const [name, fn] of Object.entries(ext.commands)) {
                const handler = (fn as CommandFunction<TypixExtensionConfig>)(extConfig)
                commands[name] = () => handler
            }
        }
    }

    // Merge shortcuts
    const shortcuts = subExts.flatMap((e) => e.shortcuts ?? [])

    return defineTypixExtension({
        name: 'starter-kit',
        typix,
        config: options,
        commands,
        shortcuts,
    })
}
