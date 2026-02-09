import { defaultExtensionNodes } from "@typix-editor/react";
import { AutocompleteNode } from "@typix-editor/extension-auto-complete";
import { KeywordNode } from "@typix-editor/extension-keywords";
import { MentionNode } from "@typix-editor/extension-mention";

// Extension nodes
export const extensionNodes = [
  ...defaultExtensionNodes,
  AutocompleteNode,
  KeywordNode,
  MentionNode,
];
