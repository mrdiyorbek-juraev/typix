import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { registerCodeHighlighting } from "@typix-editor/core/lexical/code-shiki";
import { defineExtension, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface CodeHighlightShikiConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable code highlighting. */
  disabled: boolean;
  /**
   * Default language to use when inserting a new code block.
   * Consumers (toolbars, commands) should read this config to pre-select
   * the correct language instead of defaulting to plain text.
   */
  defaultLanguage?: string;
}

export const CodeHighlightShikiExtension = (
  userConfig: Partial<CodeHighlightShikiConfig> = {}
) => {
  const resolvedConfig: CodeHighlightShikiConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/code-highlight-shiki",

    config: safeCast<CodeHighlightShikiConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        return registerCodeHighlighting(editor);
      });
    },
  });

  return defineTypixExtension({
    name: "code-highlight-shiki",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
