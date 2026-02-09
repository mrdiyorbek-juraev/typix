"use client";
import { LinkNode } from "@typix-editor/react/lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "@typix-editor/react";
import { type JSX, useEffect } from "react";

export interface LinkExtensionProps {
  /**
   * Custom URL validator function
   * @default validateUrl from @typix-editor/react
   */
  validateUrl?: (url: string) => boolean;
}

export function LinkExtension({
  validateUrl: customValidateUrl,
}: LinkExtensionProps): JSX.Element {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error(
        "LinkExtension: LinkNode is not registered in the editor. " +
        "Make sure to include LinkNode in your extensionNodes array."
      );
    }
  }, [editor]);

  const urlValidator = customValidateUrl || validateUrl;

  return <LexicalLinkPlugin validateUrl={urlValidator} />;
}

LinkExtension.displayName = "Typix.LinkExtension";
