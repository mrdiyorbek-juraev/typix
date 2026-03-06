import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import {
  AutoLinkNode,
  type ChangeHandler,
  createLinkMatcherWithRegExp,
  type LinkMatcher,
  registerAutoLink,
} from "@typix-editor/core/lexical/link";
import { defineExtension, safeCast } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { EMAIL_REGEX, URL_REGEX } from "../lib";

export const MATCHERS: LinkMatcher[] = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) =>
    text.startsWith("http") ? text : `https://${text}`
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => `mailto:${text}`),
];

export interface AutoLinkConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable auto-link detection. */
  disabled: boolean;
  matchers?: LinkMatcher[];
  onChange?: ChangeHandler;
  /**
   * Default HTML attributes applied to every auto-detected link node.
   * Useful for setting `target="_blank"` or a custom `rel` policy globally.
   * @example { target: '_blank', rel: 'noopener noreferrer' }
   */
  defaultAttributes?: { rel?: string; target?: string };
}

export const AutoLinkExtension = (userConfig: Partial<AutoLinkConfig> = {}) => {
  const resolvedConfig: AutoLinkConfig = {
    disabled: false,
    matchers: MATCHERS,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/auto-link",

    nodes: () => [AutoLinkNode],

    config: safeCast<AutoLinkConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled, matchers, onChange, defaultAttributes } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        const baseMatchers = matchers?.value ?? MATCHERS;
        const attrs = defaultAttributes?.value;

        // Wrap each matcher to inject defaultAttributes into every match result
        const currentMatchers: LinkMatcher[] = attrs
          ? baseMatchers.map((matcher) => (text) => {
              const result = matcher(text);
              if (!result) return null;
              return { ...result, attributes: { ...attrs, ...result.attributes } };
            })
          : baseMatchers;

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

  return defineTypixExtension({
    name: "auto-link",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
