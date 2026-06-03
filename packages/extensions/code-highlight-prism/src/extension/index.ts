import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { registerCodeHighlighting } from "@typix-editor/core/lexical/code";
import { defineExtension, safeCast } from "lexical";

export interface CodeHighlightPrismConfig {
  /** Set to true to temporarily disable code highlighting. */
  disabled: boolean;
  /**
   * Default language to use when inserting a new code block.
   * Consumers (toolbars, commands) should read this config to pre-select
   * the correct language instead of defaulting to plain text.
   */
  defaultLanguage?: string;
}

export const CodeHighlightPrismExtension = (
  userConfig: Partial<CodeHighlightPrismConfig> = {}
) => {
  const resolvedConfig: CodeHighlightPrismConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/code-highlight-prism",

    config: safeCast<CodeHighlightPrismConfig>(resolvedConfig),

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

  return lexicalExt;
};
