import {
  defineExtension,
  safeCast,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  type LexicalEditor,
} from "lexical";
import { $createQuoteNode, $isQuoteNode, QuoteNode } from "@typix-editor/core/lexical/rich-text";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals } from "@typix-editor/core/lexical/extension";

export interface BlockquoteConfig extends TypixExtensionConfig {
  disabled?: boolean;
}

/**
 * BlockquoteExtension — toggles blockquote on selected blocks.
 *
 * If the selection is already a blockquote, it falls back to a paragraph.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [BlockquoteExtension()] })
 *
 * editor.chain().toggleBlockquote().run()
 * editor.isActive('quote') // → true/false
 * ```
 */
export const BlockquoteExtension = (
  userConfig: Partial<BlockquoteConfig> = {}
) => {
  const resolvedConfig: BlockquoteConfig = { ...userConfig };
  const lexicalExt = defineExtension({
    name: "@typix/blockquote",
    config: safeCast<BlockquoteConfig>(resolvedConfig),
    mergeConfig(
      a: BlockquoteConfig,
      b: Partial<BlockquoteConfig>
    ): BlockquoteConfig {
      return { ...a, ...b };
    },
    nodes: () => [QuoteNode],
    build(_editor: LexicalEditor, config: BlockquoteConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<BlockquoteConfig>({
    name: "blockquote",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleBlockquote: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const anchor = selection.anchor.getNode();
          const parent = anchor.getParent();
          const isAlready = $isQuoteNode(parent);
          $setBlocksType(selection, () =>
            isAlready ? $createParagraphNode() : $createQuoteNode()
          );
        });
        return true;
      },
    },
    shortcuts: [
      { key: "q", modifiers: ["mod", "shift"], command: "toggleBlockquote" },
    ],
  });
};
