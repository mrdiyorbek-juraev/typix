"use client"
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "@typix-editor/react";
import type { JSX } from "react";

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
  const urlValidator = customValidateUrl || validateUrl;

  return (
    <LexicalLinkPlugin validateUrl={urlValidator} />
  );
}

LinkExtension.displayName = "Typix.LinkExtension";
