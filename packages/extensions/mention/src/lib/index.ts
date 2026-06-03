/**
 * Build regex for matching mention triggers.
 */
export function buildMentionRegex(
  trigger: string,
  maxLength: number,
  allowSpaces: boolean
): RegExp {
  const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const punctuation =
    "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";

  const validChars = allowSpaces
    ? `[^${escapedTrigger}${punctuation}]`
    : `[^${escapedTrigger}${punctuation}\\s]`;

  const validJoins = allowSpaces
    ? `(?:\\.[ |$]| |[${punctuation}]|)`
    : `(?:[${punctuation}]|)`;

  return new RegExp(
    `(^|\\s|\\()([${escapedTrigger}]((?:${validChars}${validJoins}){0,${maxLength}}))$`
  );
}

/**
 * Check for mention trigger match in text.
 */
export function checkForMentionMatch(
  text: string,
  trigger: string,
  minLength: number,
  maxLength: number,
  allowSpaces: boolean
): {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
  trigger: string;
} | null {
  const regex = buildMentionRegex(trigger, maxLength, allowSpaces);
  const match = regex.exec(text);

  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];

    if (matchingString.length >= minLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
        trigger,
      };
    }
  }

  return null;
}
