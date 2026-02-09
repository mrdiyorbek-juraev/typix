import { registerCodeHighlighting } from "@lexical/code-shiki";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { JSX } from "react";
import { useEffect } from "react";

export function CodeHighlightShikiExtension(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => registerCodeHighlighting(editor), [editor]);

  return null;
}

CodeHighlightShikiExtension.displayName = "Typix.CodeHighlightShikiExtension";
