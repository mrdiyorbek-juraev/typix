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

export interface ItalicConfig extends TypixExtensionConfig {
  disabled?: boolean;
}

/**
 * ItalicExtension — toggles italic formatting on the current selection.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [ItalicExtension()] })
 *
 * editor.chain().toggleItalic().run()
 * editor.isActive('italic') // → true/false
 * ```
 */
export const ItalicExtension = (userConfig: Partial<ItalicConfig> = {}) => {
  const resolvedConfig: ItalicConfig = { ...userConfig };
  const lexicalExt = defineExtension({
    name: "@typix/italic",
    config: safeCast<ItalicConfig>(resolvedConfig),
    mergeConfig(a: ItalicConfig, b: Partial<ItalicConfig>): ItalicConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: ItalicConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<ItalicConfig>({
    name: "italic",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleItalic: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        return true;
      },
    },
    shortcuts: [{ key: "i", modifiers: ["mod"], command: "toggleItalic" }],
  });
};
