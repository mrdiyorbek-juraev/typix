import type { JSX } from "react";

import {
  AutoLinkPlugin,
  ChangeHandler,
  createLinkMatcherWithRegExp,
  LinkMatcher,
} from "@lexical/react/LexicalAutoLinkPlugin";
import { EMAIL_REGEX, URL_REGEX } from "../lib";

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) => {
    return text.startsWith("http") ? text : `https://${text}`;
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return `mailto:${text}`;
  }),
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
