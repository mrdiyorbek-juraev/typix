import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
} from "lexical";
import {
  $patchStyleText,
} from "@typix-editor/core/lexical/selection";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals } from "@typix-editor/core/lexical/extension";

export interface HighlightConfig extends TypixExtensionConfig {
  disabled?: boolean;
}

/**
 * HighlightExtension — toggles highlight formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [HighlightExtension()] })
 *
 * editor.chain().toggleHighlight().run()
 * editor.chain().setHighlightColor({ color: 'var(--color-pink-200)' }).run()
 * editor.chain().removeHighlightColor().run()
 * ```
 */
export const HighlightExtension = (
  userConfig: Partial<HighlightConfig> = {}
) => {
  const resolvedConfig: HighlightConfig = { ...userConfig };
  const lexicalExt = defineExtension({
    name: "@typix/highlight",
    config: safeCast<HighlightConfig>(resolvedConfig),
    mergeConfig(
      a: HighlightConfig,
      b: Partial<HighlightConfig>
    ): HighlightConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: HighlightConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<HighlightConfig>({
    name: "highlight",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleHighlight: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        return true;
      },

      /** Apply an inline background-color to the current selection. */
      setHighlightColor: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const color = attrs?.color as string | undefined;
        if (!color) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "background-color": color });
          }
        });
        return true;
      },

      /** Remove inline background-color from the current selection. */
      removeHighlightColor: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "background-color": "" });
          }
        });
        return true;
      },
    },
  });
};
