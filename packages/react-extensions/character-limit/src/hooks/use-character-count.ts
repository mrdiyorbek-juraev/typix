import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $rootTextContent } from "@lexical/text";
import { useEffect, useState } from "react";

// Singleton — one encoder shared across all hook instances.
let encoderInstance: TextEncoder | null = null;

function getEncoder(): TextEncoder | null {
  if (typeof window === "undefined" || !window.TextEncoder) return null;
  if (!encoderInstance) encoderInstance = new window.TextEncoder();
  return encoderInstance;
}

function utf8Length(text: string): number {
  const enc = getEncoder();
  if (!enc) {
    // Fallback: http://stackoverflow.com/a/5515960/210370
    const m = encodeURIComponent(text).match(/%[89ABab]/g);
    return text.length + (m ? m.length : 0);
  }
  return enc.encode(text).length;
}

function strLen(text: string, charset: "UTF-8" | "UTF-16"): number {
  return charset === "UTF-8" ? utf8Length(text) : text.length;
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export interface UseCharacterCountOptions {
  /**
   * Charset used for byte-counting characters.
   * UTF-16 counts each JS character as 1 (like `string.length`).
   * UTF-8 counts actual byte size (multi-byte for non-ASCII).
   * @default "UTF-16"
   */
  charset?: "UTF-8" | "UTF-16";
}

export interface CharacterCountStats {
  /** Character count in the chosen charset */
  characters: number;
  /** Word count */
  words: number;
}

/**
 * Returns live character and word counts for the current Lexical editor.
 * Must be used inside an `EditorRoot` (or any `LexicalComposer`).
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const { characters, words } = useCharacterCount();
 *   return <span>{characters} chars · {words} words</span>;
 * }
 * ```
 */
export function useCharacterCount({
  charset = "UTF-16",
}: UseCharacterCountOptions = {}): CharacterCountStats {
  const [editor] = useLexicalComposerContext();

  const [stats, setStats] = useState<CharacterCountStats>(() => {
    const text = editor.getEditorState().read($rootTextContent);
    return { characters: strLen(text, charset), words: countWords(text) };
  });

  useEffect(() => {
    return editor.registerTextContentListener((text) => {
      setStats({ characters: strLen(text, charset), words: countWords(text) });
    });
  }, [editor, charset]);

  return stats;
}
