import {
  AutoLinkPlugin,
  type ChangeHandler,
  createLinkMatcherWithRegExp,
  type LinkMatcher,
} from "@lexical/react/LexicalAutoLinkPlugin";
import type { JSX } from "react";
import { EMAIL_REGEX, URL_REGEX } from "../lib";

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) =>
    text.startsWith("http") ? text : `https://${text}`
  ),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => `mailto:${text}`),
];

export function AutoLinkExtension({
  matchers = MATCHERS,
  onChange,
}: {
  matchers?: LinkMatcher[];
  onChange?: ChangeHandler;
}): JSX.Element {
  return <AutoLinkPlugin matchers={matchers} onChange={onChange} />;
}

AutoLinkExtension.displayName = "Typix.AutoLinkExtension";
