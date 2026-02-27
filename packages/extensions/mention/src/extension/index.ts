import { defineExtension, safeCast } from "lexical";
import { MentionNode } from "../node";

export interface MentionConfig {
  /** Character(s) that trigger the mention menu. @default '@' */
  trigger: string;
  /** Minimum number of characters after trigger before searching. @default 0 */
  minLength: number;
  /** Maximum length of the mention query. @default 75 */
  maxLength: number;
  /** Whether to allow spaces in mention queries. @default true */
  allowSpaces: boolean;
  /** Maximum number of suggestions to display. @default 10 */
  maxSuggestions: number;
  /** Debounce delay in milliseconds for search requests. @default 200 */
  debounceMs: number;
  /** Whether to include the trigger character in the displayed mention text. @default true */
  includeTrigger: boolean;
  /** Whether the extension is disabled. @default false */
  disabled: boolean;
}

export const MentionExtension = defineExtension({
  name: "@typix/mention",

  nodes: () => [MentionNode],

  config: safeCast<MentionConfig>({
    trigger: "@",
    minLength: 0,
    maxLength: 75,
    allowSpaces: true,
    maxSuggestions: 10,
    debounceMs: 200,
    includeTrigger: true,
    disabled: false,
  }),
});
