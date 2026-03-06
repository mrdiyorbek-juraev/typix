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

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(?<![-.+():%])/;

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const DEFAULT_MATCHERS: LinkMatcher[] = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) =>
    text.startsWith("http") ? text : `https://${text}`
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => `mailto:${text}`),
];

export interface AutoLinkConfig extends TypixExtensionConfig {
  disabled: boolean;
  matchers?: LinkMatcher[];
  onChange?: ChangeHandler;
}

export const AutoLinkExtension = (userConfig: Partial<AutoLinkConfig> = {}) => {
  const resolvedConfig: AutoLinkConfig = {
    disabled: false,
    matchers: DEFAULT_MATCHERS,
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
      const { disabled, matchers, onChange } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        const currentMatchers = matchers?.value ?? DEFAULT_MATCHERS;
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
