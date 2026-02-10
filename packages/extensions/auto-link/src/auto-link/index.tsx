import { AutoLinkNode } from "@lexical/link";
import {
  AutoLinkPlugin,
  type ChangeHandler,
  createLinkMatcherWithRegExp,
  type LinkMatcher,
} from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { type JSX, useEffect } from "react";
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
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([AutoLinkNode])) {
      throw new Error(
        "AutoLinkExtension: AutoLinkNode is not registered in the editor. " +
          "Make sure to include AutoLinkNode in your extensionNodes array."
      );
    }
  }, [editor]);

  return <AutoLinkPlugin matchers={matchers} onChange={onChange} />;
}

AutoLinkExtension.displayName = "Typix.AutoLinkExtension";
