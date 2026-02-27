import { CharacterLimitPlugin as LexicalCharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import type { JSX } from "react";
import type { CharacterLimitUIProps } from "../types";

/**
 * CharacterLimitUI
 *
 * Renders an inline remaining-character counter and highlights overflow text.
 * Uses Lexical's built-in `CharacterLimitPlugin` under the hood.
 *
 * Pair with `useCharacterCount` when you need the counts in your own UI
 * (e.g. a counter below the editor), and use this component when you want
 * the inline overflow highlight + inline counter.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <CharacterLimitUI maxLength={280} charset="UTF-16" />
 * </EditorRoot>
 * ```
 */
export function CharacterLimitUI({
  maxLength,
  charset = "UTF-16",
}: CharacterLimitUIProps): JSX.Element {
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

CharacterLimitUI.displayName = "Typix.CharacterLimitUI";
