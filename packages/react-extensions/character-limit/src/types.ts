export interface CharacterLimitUIProps {
  /**
   * Maximum number of characters allowed.
   */
  maxLength: number;

  /**
   * Charset used for counting.
   * UTF-16 counts each JS character as 1 (like `string.length`).
   * UTF-8 counts actual byte size (multi-byte for non-ASCII).
   * @default "UTF-16"
   */
  charset?: "UTF-8" | "UTF-16";
}

/** @deprecated Use CharacterLimitUIProps */
export type CharacterLimitExtensionProps = CharacterLimitUIProps;
