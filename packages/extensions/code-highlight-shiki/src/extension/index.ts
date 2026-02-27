import { effect, namedSignals } from "@lexical/extension";
import { registerCodeHighlighting } from "@lexical/code-shiki";
import { defineExtension, safeCast } from "lexical";

export interface CodeHighlightShikiConfig {
  /** Set to true to temporarily disable code highlighting. */
  disabled: boolean;
}

export const CodeHighlightShikiExtension = defineExtension({
  name: "@typix/code-highlight-shiki",

  config: safeCast<CodeHighlightShikiConfig>({ disabled: false }),

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
