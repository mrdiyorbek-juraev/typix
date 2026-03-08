import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { buildSuggestionTriggerFn } from "./trigger-match";
import { useSuggestionItems } from "./use-suggestion-items";
import type { SuggestionItem, SuggestionMenuProps } from "./types";

class SuggestionMenuOption<T> extends MenuOption {
  item: SuggestionItem<T>;
  constructor(item: SuggestionItem<T>, index: number) {
    super(`suggestion-option-${index}`);
    this.item = item;
  }
}

function SuggestionMenu<T = unknown>(props: SuggestionMenuProps<T>) {
  const {
    char = "@",
    items: itemsFn,
    children,
    allowSpaces = false,
    allowToIncludeChar = false,
    allowedPrefixes = [" "],
    startOfLine = false,
    minLength = 0,
    maxLength = 75,
    debounceMs = 0,
    disabled = false,
  } = props;

  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  // Stable reference for allowedPrefixes — avoids JSON.stringify on every render
  const prefixesRef = useRef(allowedPrefixes);
  const stablePrefixes = useMemo(() => {
    const prev = prefixesRef.current;
    if (prev === allowedPrefixes) return prev;
    if (
      prev !== null &&
      allowedPrefixes !== null &&
      prev.length === allowedPrefixes.length &&
      prev.every((p, i) => p === allowedPrefixes[i])
    ) {
      return prev;
    }
    prefixesRef.current = allowedPrefixes;
    return allowedPrefixes;
  }, [allowedPrefixes]);

  // Cache the compiled trigger function — regex only rebuilt when options change
  const cachedTrigger = useMemo(
    () =>
      buildSuggestionTriggerFn({
        char,
        allowSpaces,
        allowToIncludeChar,
        allowedPrefixes: stablePrefixes,
        startOfLine,
        minLength,
        maxLength,
      }),
    [
      char,
      allowSpaces,
      allowToIncludeChar,
      stablePrefixes,
      startOfLine,
      minLength,
      maxLength,
    ],
  );

  const triggerFn = useCallback(
    (text: string) => {
      if (disabled) return null;
      return cachedTrigger(text, editor);
    },
    [disabled, cachedTrigger, editor],
  );

  // Stable ref for itemsFn so debounce isn't defeated by inline arrow functions
  const itemsFnRef = useRef(itemsFn);
  itemsFnRef.current = itemsFn;
  const stableItemsFn = useCallback(
    (p: { query: string; editor: typeof editor }) => itemsFnRef.current(p),
    [],
  );

  const { items, isLoading } = useSuggestionItems<T>({
    query: queryString,
    editor,
    itemsFn: stableItemsFn,
    debounceMs,
  });

  const options = useMemo(
    () => items.map((item, i) => new SuggestionMenuOption<T>(item, i)),
    [items],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: SuggestionMenuOption<T>,
      nodeToRemove: Parameters<
        Parameters<typeof LexicalTypeaheadMenuPlugin>[0]["onSelectOption"]
      >[1],
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        selectedOption.item.onSelect({
          editor,
          nodeToRemove,
          query: matchingString,
          context: selectedOption.item.context,
        });
        closeMenu();
      });
    },
    [editor],
  );

  // Stable refs for menuRenderFn closure — avoids re-creating the render function
  const itemsRef = useRef(items);
  const optionsRef = useRef(options);
  const isLoadingRef = useRef(isLoading);
  const childrenRef = useRef(children);
  itemsRef.current = items;
  optionsRef.current = options;
  isLoadingRef.current = isLoading;
  childrenRef.current = children;

  const menuRenderFn = useCallback(
    (
      anchorElementRef: React.RefObject<HTMLElement | null>,
      {
        selectedIndex,
        selectOptionAndCleanUp,
        setHighlightedIndex,
      }: {
        selectedIndex: number | null;
        selectOptionAndCleanUp: (option: SuggestionMenuOption<T>) => void;
        setHighlightedIndex: (index: number) => void;
      },
      matchingString: string | null,
    ) => {
      const anchor = anchorElementRef.current;
      const currentItems = itemsRef.current;
      const currentOptions = optionsRef.current;

      if (!anchor || currentItems.length === 0) return null;

      const onSelect = (item: SuggestionItem<T>) => {
        const index = currentItems.indexOf(item);
        const option = currentOptions[index];
        if (!option) return;
        setHighlightedIndex(index);
        selectOptionAndCleanUp(option);
      };

      const rendered = childrenRef.current({
        items: currentItems,
        selectedIndex: selectedIndex ?? 0,
        query: matchingString,
        isLoading: isLoadingRef.current,
        onSelect,
      });

      if (rendered === null) return null;

      return createPortal(
        <div onMouseDown={(e) => e.preventDefault()}>{rendered}</div>,
        anchor,
      );
    },
    [],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      options={options}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={triggerFn}
      menuRenderFn={menuRenderFn}
    />
  );
}

export { SuggestionMenu };
