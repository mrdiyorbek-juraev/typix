import { defineExtension, safeCast } from "lexical";

export interface CharacterLimitConfig {
  /** Maximum number of characters allowed. */
  maxLength: number;
  /**
   * Charset used for counting.
   * UTF-16 counts each JS character as 1 (like `string.length`).
   * UTF-8 counts actual byte size (multi-byte for non-ASCII).
   * @default "UTF-16"
   */
  charset: "UTF-8" | "UTF-16";
  /** Set to true to temporarily disable the character limit behavior. */
  disabled: boolean;
}

export const CharacterLimitExtension = defineExtension({
  name: "@typix/character-limit",
  config: safeCast<CharacterLimitConfig>({
    maxLength: 280,
    charset: "UTF-16",
    disabled: false,
  }),
});
