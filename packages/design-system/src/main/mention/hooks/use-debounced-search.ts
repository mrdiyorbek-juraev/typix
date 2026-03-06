import { useEffect, useRef, useState } from "react";
import type {
  MentionItem,
  MentionSearchFn,
} from "@typix-editor/extension-mention";

export function useDebouncedSearch(
  query: string | null,
  trigger: string,
  onSearch: MentionSearchFn,
  debounceMs: number,
  maxSuggestions: number
): { results: MentionItem[]; isLoading: boolean } {
  const [results, setResults] = useState<MentionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query === null) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const searchResults = await onSearch(query, trigger);
        if (!cancelled) {
          setResults(searchResults.slice(0, maxSuggestions));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Mention search error:", error);
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, trigger, onSearch, debounceMs, maxSuggestions]);

  return { results, isLoading };
}
