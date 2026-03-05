import {
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals } from "@lexical/extension";

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
    },
  });
};
