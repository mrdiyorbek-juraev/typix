import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
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

export interface TextColorConfig extends TypixExtensionConfig {
  disabled?: boolean;
}

/**
 * TextColorExtension — applies an inline `color` style to the current selection.
 *
 * Uses `$patchStyleText` (no Lexical format bit needed).
 *
 * @example
 * ```ts
 * createTypix({ extensions: [TextColorExtension()] })
 *
 * editor.chain().setTextColor({ color: 'var(--color-red-500)' }).run()
 * editor.chain().removeTextColor().run()
 * ```
 */
export const TextColorExtension = (
  userConfig: Partial<TextColorConfig> = {}
) => {
  const resolvedConfig: TextColorConfig = { ...userConfig };
  const lexicalExt = defineExtension({
    name: "@typix/text-color",
    config: safeCast<TextColorConfig>(resolvedConfig),
    mergeConfig(
      a: TextColorConfig,
      b: Partial<TextColorConfig>
    ): TextColorConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: TextColorConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<TextColorConfig>({
    name: "text-color",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /** Apply an inline color to the current selection. */
      setTextColor: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const color = attrs?.color as string | undefined;
        if (!color) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { color });
          }
        });
        return true;
      },

      /** Remove inline color from the current selection. */
      removeTextColor: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { color: "" });
          }
        });
        return true;
      },
    },
  });
};
