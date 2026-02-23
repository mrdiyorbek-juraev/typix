import { CharacterLimitPlugin as LexicalCharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import type { JSX } from "react";

export interface CharacterLimitExtensionProps {
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

/**
 * CharacterLimitExtension
 *
 * Renders an inline remaining-character counter and highlights overflow text.
 * Uses Lexical's built-in `CharacterLimitPlugin` under the hood.
 *
 * Pair with `useCharacterCount` when you need the counts in your own UI
 * (e.g. a counter below the editor), and use this extension when you want
 * the inline overflow highlight + inline counter.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <CharacterLimitExtension maxLength={280} charset="UTF-16" />
 * </EditorRoot>
 * ```
 */
export function CharacterLimitExtension({
  maxLength,
  charset = "UTF-16",
}: CharacterLimitExtensionProps): JSX.Element {
  return (
    <LexicalCharacterLimitPlugin
      charset={charset}
      maxLength={maxLength}
      renderer={({ remainingCharacters }) => {
        const isExceeded = remainingCharacters <= 0;
        const isWarning =
          !isExceeded && remainingCharacters <= Math.ceil(maxLength * 0.1);

        const modifier = isExceeded
          ? "typix-character-limit__counter--exceeded"
          : isWarning
            ? "typix-character-limit__counter--warning"
            : "";

        return (
          <span
            className={`typix-character-limit__counter${modifier ? ` ${modifier}` : ""}`}
          >
            {remainingCharacters}
          </span>
        );
      }}
    />
  );
}

CharacterLimitExtension.displayName = "Typix.CharacterLimitExtension";
