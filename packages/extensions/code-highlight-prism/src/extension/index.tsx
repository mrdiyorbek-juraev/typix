import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { JSX } from "react";
import { useEffect } from "react";

export function CodeHighlightPrismExtension(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => registerCodeHighlighting(editor), [editor]);

  return null;
}

CodeHighlightPrismExtension.displayName = "Typix.CodeHighlightPrismExtension";
