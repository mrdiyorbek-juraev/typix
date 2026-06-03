import * as React from "react";
import { cn } from "../../../lib/utils";
import type { CharacterLimitCounterProps } from "../types";

/**
 * Standalone counter display for character limits.
 * Use with `useCharacterCount` hook to get live stats.
 *
 * @example
 * ```tsx
 * const { characters, words } = useCharacterCount()
 * <CharacterLimitCounter count={characters} maxLength={280} words={words} showWords />
 * ```
 */
export function CharacterLimitCounter({
  count,
  maxLength,
  words,
  warningThreshold = 0.1,
  showWords = false,
  className,
}: CharacterLimitCounterProps) {
  const remaining = maxLength - count;
  const isExceeded = remaining < 0;
  const isWarning =
    !isExceeded && remaining <= Math.ceil(maxLength * warningThreshold);
  const percentage = Math.min((count / maxLength) * 100, 100);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs tabular-nums select-none",
        className
      )}
    >
      {/* Circular progress indicator */}
      <div className="relative size-5">
        <svg className="size-5 -rotate-90" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
            className="stroke-muted"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 8}`}
            strokeDashoffset={`${2 * Math.PI * 8 * (1 - percentage / 100)}`}
            className={cn(
              "transition-all duration-200",
              isExceeded
                ? "stroke-destructive"
                : isWarning
                  ? "stroke-amber-500"
                  : "stroke-primary"
            )}
          />
        </svg>
      </div>

      {/* Text counter */}
      <span
        className={cn(
          "transition-colors duration-200",
          isExceeded
            ? "text-destructive font-medium"
            : isWarning
              ? "text-amber-500"
              : "text-muted-foreground"
        )}
      >
        {remaining}
      </span>

      {showWords && words !== undefined && (
        <>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground">
            {words} {words === 1 ? "word" : "words"}
          </span>
        </>
      )}
    </div>
  );
}

CharacterLimitCounter.displayName = "Typix.CharacterLimitCounter";
