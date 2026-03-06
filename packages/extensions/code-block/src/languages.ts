import {
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  getCodeLanguages,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from "@typix-editor/core/lexical/code";

/**
 * Full map of language key → human-readable display name.
 * Sourced directly from Lexical's built-in Prism language list.
 *
 * @example
 * LANGUAGE_MAP['javascript'] // 'JavaScript'
 * LANGUAGE_MAP['typescript'] // 'TypeScript'
 */
export const LANGUAGE_MAP: Record<string, string> =
  CODE_LANGUAGE_FRIENDLY_NAME_MAP;

/**
 * Sorted array of all supported language keys.
 * Suitable for rendering a language selector.
 *
 * @example ['abap', 'agda', 'arduino', ...]
 */
export const LANGUAGE_KEYS: string[] = getCodeLanguages().sort();

/**
 * Get the human-readable display name for a language key.
 * Falls back to the key itself if no friendly name is found.
 *
 * @example
 * getLanguageDisplayName('javascript') // 'JavaScript'
 * getLanguageDisplayName('unknown')    // 'unknown'
 */
export function getLanguageDisplayName(key: string): string {
  return getLanguageFriendlyName(key) || key;
}

/**
 * Normalize a language string to its canonical Prism key.
 * Handles aliases (e.g. 'js' → 'javascript').
 */
export function normalizeLanguage(lang: string): string {
  return normalizeCodeLang(lang);
}

/**
 * Filter and search language entries by a query string.
 * Matches against both the language key and the friendly display name.
 * Deduplicates by display name — aliases (e.g. "js" → "JavaScript") are
 * collapsed into their canonical entry so each language appears only once.
 *
 * @param query - Search string (case-insensitive)
 * @param keys  - Language keys to search within. Defaults to all supported languages.
 * @returns Sorted array of matching `{ key, label }` entries
 */
export function searchLanguages(
  query: string,
  keys: string[] = LANGUAGE_KEYS
): { key: string; label: string }[] {
  const q = query.toLowerCase().trim();
  const seenLabels = new Set<string>();

  return keys
    .map((key) => ({ key, label: getLanguageDisplayName(key) }))
    .filter(({ key, label }) => {
      // Deduplicate by label — keep only the first key for each display name
      const labelLower = label.toLowerCase();
      if (seenLabels.has(labelLower)) return false;
      seenLabels.add(labelLower);

      return (
        q === "" || key.toLowerCase().includes(q) || labelLower.includes(q)
      );
    });
}
