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

export interface UnderlineConfig extends TypixExtensionConfig {
  disabled?: boolean;
}

/**
 * UnderlineExtension — toggles underline formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [UnderlineExtension()] })
 *
 * editor.chain().toggleUnderline().run()
 * ```
 */
export const UnderlineExtension = (
  userConfig: Partial<UnderlineConfig> = {}
) => {
  const resolvedConfig: UnderlineConfig = { ...userConfig };
  const lexicalExt = defineExtension({
    name: "@typix/underline",
    config: safeCast<UnderlineConfig>(resolvedConfig),
    mergeConfig(
      a: UnderlineConfig,
      b: Partial<UnderlineConfig>
    ): UnderlineConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: UnderlineConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<UnderlineConfig>({
    name: "underline",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleUnderline: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        return true;
      },
    },
    shortcuts: [{ key: "u", modifiers: ["mod"], command: "toggleUnderline" }],
  });
};
