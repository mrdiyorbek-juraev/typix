export type CharacterLimitCharset = "UTF-8" | "UTF-16";

export interface CharacterCountStats {
  /** Character count in the chosen charset */
  characters: number;
  /** Word count */
  words: number;
}

export interface UseCharacterCountOptions {
  /**
   * Charset used for byte-counting characters.
   * UTF-16 counts each JS character as 1 (like `string.length`).
   * UTF-8 counts actual byte size (multi-byte for non-ASCII).
   * @default "UTF-16"
   */
  charset?: CharacterLimitCharset;
}

export interface CharacterLimitProps {
  /**
   * Maximum number of characters allowed.
   */
  maxLength: number;

  /**
   * Charset used for counting.
   * @default "UTF-16"
   */
  charset?: CharacterLimitCharset;

  /**
   * Warning threshold as a percentage of maxLength (0-1).
   * When remaining characters fall below this ratio, the counter enters warning state.
   * @default 0.1
   */
  warningThreshold?: number;
}

export interface CharacterLimitCounterProps {
  /** Current character count */
  count: number;

  /** Maximum characters allowed */
  maxLength: number;

  /** Word count */
  words?: number;

  /**
   * Warning threshold as a percentage of maxLength (0-1).
   * @default 0.1
   */
  warningThreshold?: number;

  /** Show word count alongside character count */
  showWords?: boolean;

  /** Additional class name */
  className?: string;
}
