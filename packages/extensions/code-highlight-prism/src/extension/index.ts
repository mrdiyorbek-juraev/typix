import { effect, namedSignals } from "@lexical/extension";
import { registerCodeHighlighting } from "@lexical/code";
import { defineExtension, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface CodeHighlightPrismConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable code highlighting. */
  disabled: boolean;
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

  return defineTypixExtension({
    name: "code-highlight-prism",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
