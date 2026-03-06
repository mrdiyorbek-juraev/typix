import { cn } from "../../../lib/utils"
import type { CharacterLimitProps } from "../types"
import { useCharacterCount } from "../hooks/use-character-count"
import { CharacterLimitCounter } from "./character-limit-counter"

/**
 * Character limit component — shows a styled counter with circular progress
 * and live character/word counts.
 *
 * Drop this inside an `EditorRoot` / `LexicalComposer`.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <CharacterLimit maxLength={280} />
 * </EditorRoot>
 * ```
 */
export function CharacterLimit({
  maxLength,
  charset = "UTF-16",
  warningThreshold = 0.1,
}: CharacterLimitProps) {
  const { characters, words } = useCharacterCount({ charset })

  return (
    <div className={cn("flex items-center justify-end px-3 py-1.5")}>
      <CharacterLimitCounter
        count={characters}
        maxLength={maxLength}
        words={words}
        warningThreshold={warningThreshold}
        showWords
      />
    </div>
  )
}

CharacterLimit.displayName = "Typix.CharacterLimit"
