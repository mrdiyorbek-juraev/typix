import { useTypixEditor } from "@typix-editor/react"
import { useEffect, useState } from "react"
import type { CharacterCountStats, UseCharacterCountOptions } from "../types"

// Singleton — one encoder shared across all hook instances.
let encoderInstance: TextEncoder | null = null

function getEncoder(): TextEncoder | null {
  if (typeof window === "undefined" || !window.TextEncoder) return null
  if (!encoderInstance) encoderInstance = new window.TextEncoder()
  return encoderInstance
}

function utf8Length(text: string): number {
  const enc = getEncoder()
  if (!enc) {
    const m = encodeURIComponent(text).match(/%[89ABab]/g)
    return text.length + (m ? m.length : 0)
  }
  return enc.encode(text).length
}

function strLen(text: string, charset: "UTF-8" | "UTF-16"): number {
  return charset === "UTF-8" ? utf8Length(text) : text.length
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
}

function computeStats(text: string, charset: "UTF-8" | "UTF-16"): CharacterCountStats {
  return { characters: strLen(text, charset), words: countWords(text) }
}

/**
 * Returns live character and word counts for the current Typix editor.
 * Must be used inside an `EditorRoot`.
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
  const editor = useTypixEditor()

  const [stats, setStats] = useState<CharacterCountStats>(() =>
    computeStats(editor.getText(), charset),
  )

  useEffect(() => {
    return editor.on("update", () => {
      setStats(computeStats(editor.getText(), charset))
    })
  }, [editor, charset])

  return stats
}
