import type { ComponentType, ReactNode } from "react";
import type { LexicalEditor, TextNode } from "lexical";

/** A single item in the suggestion menu dropdown. */
export interface SuggestionItem<T = unknown> {
  /** Display label for the item. */
  title: string;
  /** Secondary text shown below the title. */
  subtext?: string;
  /** Icon component or emoji string rendered beside the title. */
  badge?: ComponentType<{ className?: string; size?: number }> | string;
  /** Group label used to visually cluster items (e.g. "Basic", "Lists"). */
  group?: string;
  /** Extra search terms that match this item beyond `title`. */
  keywords?: string[];
  /** Arbitrary data payload forwarded to `onSelect` and render props. */
  context?: T;
  /** Called when the user picks this item. */
  onSelect: (props: SuggestionSelectProps<T>) => void;
}

/** Props passed to `SuggestionItem.onSelect` when an item is selected. */
export interface SuggestionSelectProps<T = unknown> {
  /** The active Lexical editor instance. */
  editor: LexicalEditor;
  /** The trigger + query text node to remove/replace, or `null` if already gone. */
  nodeToRemove: TextNode | null;
  /** The raw query string the user typed after the trigger character. */
  query: string;
  /** The selected item's context data. */
  context?: T;
}

/** Props provided to the render-prop `children` of `SuggestionMenu`. */
export type SuggestionMenuRenderProps<T = unknown> = {
  /** The filtered list of items to display. */
  items: SuggestionItem<T>[];
  /** Index of the keyboard-highlighted item (-1 when none). */
  selectedIndex: number;
  /** Current query string, or `null` when the menu is closed. */
  query: string | null;
  /** `true` while an async `items` function is in-flight. */
  isLoading: boolean;
  /** Call this to programmatically select an item. */
  onSelect: (item: SuggestionItem<T>) => void;
};

/** Props for the `<SuggestionMenu>` component. */
export interface SuggestionMenuProps<T = unknown> {
  /** Trigger character that opens the menu (e.g. `"/"`, `"@"`). */
  char?: string;
  /** Unique key when mounting multiple menus with the same trigger. */
  pluginKey?: string;
  /** Returns items (sync or async) for the current query. */
  items: (props: {
    query: string;
    editor: LexicalEditor;
  }) => SuggestionItem<T>[] | Promise<SuggestionItem<T>[]>;
  /** Render prop that receives menu state and renders the dropdown UI. */
  children: (props: SuggestionMenuRenderProps<T>) => ReactNode;
  /** Allow spaces in the query string (useful for mentions). */
  allowSpaces?: boolean;
  /** Include the trigger character in the query passed to `items`. */
  allowToIncludeChar?: boolean;
  /** Characters allowed immediately before the trigger, or `null` for any. */
  allowedPrefixes?: string[] | null;
  /** Only trigger when the character is at the start of a line. */
  startOfLine?: boolean;
  /** Minimum query length before calling `items`. */
  minLength?: number;
  /** Maximum query length; menu closes if exceeded. */
  maxLength?: number;
  /** Debounce delay (ms) for async `items` calls. */
  debounceMs?: number;
  /** Disable the menu entirely when `true`. */
  disabled?: boolean;
}
