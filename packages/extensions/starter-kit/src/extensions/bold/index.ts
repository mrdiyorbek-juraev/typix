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
import { namedSignals } from "@typix-editor/core/lexical/extension";

export interface BoldConfig extends TypixExtensionConfig {
  disabled?: boolean;
}

/**
 * BoldExtension — toggles bold formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [BoldExtension()] })
 *
 * editor.chain().toggleBold().run()
 * editor.isActive('bold') // → true/false
 * ```
 */
export const BoldExtension = (userConfig: Partial<BoldConfig> = {}) => {
  const resolvedConfig: BoldConfig = { ...userConfig };
  const lexicalExt = defineExtension({
    name: "@typix/bold",
    config: safeCast<BoldConfig>(resolvedConfig),
    mergeConfig(a: BoldConfig, b: Partial<BoldConfig>): BoldConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: BoldConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<BoldConfig>({
    name: "bold",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleBold: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        return true;
      },
    },
    shortcuts: [{ key: "b", modifiers: ["mod"], command: "toggleBold" }],
  });
};
