import type { SuggestionItem } from "./types";

export function filterSuggestionItems<T = unknown>(
  items: SuggestionItem<T>[],
  query: string,
): SuggestionItem<T>[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtext?.toLowerCase().includes(q) ||
      item.keywords?.some((kw) => kw.toLowerCase().includes(q)),
  );
}
