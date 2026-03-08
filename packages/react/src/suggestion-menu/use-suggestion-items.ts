import { useEffect, useRef, useState } from "react";
import type { LexicalEditor } from "lexical";
import type { SuggestionItem } from "./types";

interface UseSuggestionItemsOptions<T> {
  query: string | null;
  editor: LexicalEditor;
  itemsFn: (props: {
    query: string;
    editor: LexicalEditor;
  }) => SuggestionItem<T>[] | Promise<SuggestionItem<T>[]>;
  debounceMs: number;
}

interface UseSuggestionItemsResult<T> {
  items: SuggestionItem<T>[];
  isLoading: boolean;
}

export function useSuggestionItems<T = unknown>(
  options: UseSuggestionItemsOptions<T>
): UseSuggestionItemsResult<T> {
  const { query, editor, itemsFn, debounceMs } = options;
  const [items, setItems] = useState<SuggestionItem<T>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Stable ref for itemsFn — protects debounce from being defeated
  // when consumer passes an inline function
  const itemsFnRef = useRef(itemsFn);
  itemsFnRef.current = itemsFn;

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (query === null) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const result = itemsFnRef.current({ query, editor });
        const resolved = result instanceof Promise ? await result : result;
        if (!cancelled) {
          setItems(resolved);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(debounceRef.current);
    };
    // itemsFn intentionally excluded — using ref to avoid debounce thrashing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, editor, debounceMs]);

  return { items, isLoading };
}
