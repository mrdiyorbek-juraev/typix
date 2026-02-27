import { effect, namedSignals } from "@lexical/extension";
import {
  AutoLinkNode,
  type ChangeHandler,
  createLinkMatcherWithRegExp,
  type LinkMatcher,
  registerAutoLink,
} from "@lexical/link";
import { defineExtension, safeCast } from "lexical";
import { EMAIL_REGEX, URL_REGEX } from "../lib";

export const MATCHERS: LinkMatcher[] = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) =>
    text.startsWith("http") ? text : `https://${text}`
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => `mailto:${text}`),
];

export interface AutoLinkConfig {
  /** Set to true to temporarily disable auto-link detection. */
  disabled: boolean;
  matchers?: LinkMatcher[];
  onChange?: ChangeHandler;
}

export const AutoLinkExtension = defineExtension({
  name: "@typix/auto-link",

  nodes: () => [AutoLinkNode],

  config: safeCast<AutoLinkConfig>({ disabled: false, matchers: MATCHERS }),

  build(_editor, config) {
    return namedSignals(config);
  },

  register(editor, _config, state) {
    const { disabled, matchers, onChange } = state.getOutput();

    return effect(() => {
      if (disabled.value) return;

      const currentMatchers = matchers?.value ?? MATCHERS;

      // Stable wrapper reads onChange.value at call-time so callback updates
      // don't trigger re-registration.
      const stableOnChange: ChangeHandler = (...args) =>
        onChange?.value?.(...args);

      return registerAutoLink(editor, {
        matchers: currentMatchers,
        changeHandlers: [stableOnChange],
      });
    });
  },
});
