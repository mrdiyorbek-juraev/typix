import { effect, namedSignals } from "@lexical/extension";
import { registerCodeHighlighting } from "@lexical/code";
import { defineExtension, safeCast } from "lexical";

export interface CodeHighlightPrismConfig {
  /** Set to true to temporarily disable code highlighting. */
  disabled: boolean;
}

export const CodeHighlightPrismExtension = defineExtension({
  name: "@typix/code-highlight-prism",

  config: safeCast<CodeHighlightPrismConfig>({ disabled: false }),

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
