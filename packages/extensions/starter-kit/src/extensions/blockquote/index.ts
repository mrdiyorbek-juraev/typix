import {
  defineExtension,
  safeCast,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import {
  $createQuoteNode,
  $isQuoteNode,
  QuoteNode,
} from "@typix-editor/core/lexical/rich-text";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
import { withTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface BlockquoteConfig {
  disabled?: boolean;
}

export const TYPIX_TOGGLE_BLOCKQUOTE = createCommand<void>(
  "TYPIX_TOGGLE_BLOCKQUOTE"
);

export const BlockquoteExtension = withTypixMeta(
  defineExtension({
    name: "@typix/blockquote",
    config: safeCast<BlockquoteConfig>({ disabled: false }),
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
    register(editor: LexicalEditor, _config: BlockquoteConfig, state: any) {
      const { disabled } = state.getOutput();
      return effect(() => {
        if (disabled?.value) return;
        return editor.registerCommand(
          TYPIX_TOGGLE_BLOCKQUOTE,
          () => {
            editor.update(() => {
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
          COMMAND_PRIORITY_EDITOR
        );
      });
    },
  }),
  {
    commands: () => ({
      toggleBlockquote: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_TOGGLE_BLOCKQUOTE, undefined),
    }),
    shortcuts: [
      { key: "q", modifiers: ["mod", "shift"], command: "toggleBlockquote" },
    ],
  }
);

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleBlockquote(): R;
  }
}
