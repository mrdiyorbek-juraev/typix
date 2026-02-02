import type { JSX } from "react";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "@typix-editor/react";

export interface LinkExtensionProps {
  /**
   * Whether to add security attributes to external links
   * - rel="noopener noreferrer" (prevents tabnapping)
   * - target="_blank" (opens in new tab)
   * @default true
   */
  hasLinkAttributes?: boolean;

  /**
   * Custom URL validator function
   * @default validateUrl from @typix-editor/react
   */
  validateUrl?: (url: string) => boolean;

  /**
   * Custom attributes for all links
   * Merged with default security attributes
   */
  customAttributes?: Record<string, string>;

  /**
   * Whether to open external links in new tab
   * Only applies when hasLinkAttributes is true
   * @default true
   */
  openExternalInNewTab?: boolean;

  /**
   * Custom rel attribute value
   * @default "noopener noreferrer"
   */
  rel?: string;
}

export function LinkExtension({
  hasLinkAttributes = true,
  validateUrl: customValidateUrl,
  customAttributes,
  openExternalInNewTab = true,
  rel = "noopener noreferrer",
}: LinkExtensionProps): JSX.Element {
  const urlValidator = customValidateUrl || validateUrl;

  const linkAttributes = hasLinkAttributes
    ? {
        rel,
        ...(openExternalInNewTab && { target: "_blank" }),
        ...customAttributes,
      }
    : customAttributes;

  return (
    <LexicalLinkPlugin validateUrl={urlValidator} attributes={linkAttributes} />
  );
}

LinkExtension.displayName = "Typix.LinkExtension";
