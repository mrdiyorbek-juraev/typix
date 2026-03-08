import type { MenuTextMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { LexicalEditor } from "lexical";

export type TriggerFn = (
  text: string,
  editor: LexicalEditor,
) => MenuTextMatch | null;

interface TriggerOptions {
  char: string;
  allowSpaces: boolean;
  allowToIncludeChar: boolean;
  allowedPrefixes: string[] | null;
  startOfLine: boolean;
  minLength: number;
  maxLength: number;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";

export function buildSuggestionTriggerFn(options: TriggerOptions): TriggerFn {
  const {
    char,
    allowSpaces,
    allowToIncludeChar,
    allowedPrefixes,
    startOfLine,
    minLength,
    maxLength,
  } = options;

  const escapedChar = escapeRegExp(char);

  let prefixGroup: string;
  if (startOfLine) {
    prefixGroup = "^()";
  } else if (allowedPrefixes === null) {
    prefixGroup = "(^|[\\s\\S])";
  } else {
    const escaped = allowedPrefixes.map(escapeRegExp).join("");
    prefixGroup = `(^|[${escaped}])`;
  }

  const validChars = allowSpaces
    ? `[^${escapedChar}${PUNCTUATION}]`
    : `[^${escapedChar}${PUNCTUATION}\\s]`;

  const queryBody = `${validChars}{0,${maxLength}}`;
  const pattern = new RegExp(
    `${prefixGroup}(${escapedChar}(${queryBody}))$`,
  );

  return (text: string): MenuTextMatch | null => {
    const match = pattern.exec(text);
    if (!match) return null;

    const leadingText = match[1] ?? "";
    const replaceableString = match[2] ?? "";
    const queryOnly = match[3] ?? "";

    if (queryOnly.length < minLength) return null;

    return {
      leadOffset: match.index + leadingText.length,
      replaceableString,
      matchingString: allowToIncludeChar ? replaceableString : queryOnly,
    };
  };
}
