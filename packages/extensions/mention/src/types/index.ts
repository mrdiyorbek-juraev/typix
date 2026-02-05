import type { MenuTextMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { JSX, ReactNode } from "react";

/**
 * Represents a mention item that can be selected from the typeahead menu.
 */
export interface MentionItem {
  /**
   * Unique identifier for the mention.
   */
  id: string;

  /**
   * Display name shown in the menu and inserted as the mention text.
   */
  name: string;

  /**
   * Optional data attached to the mention (e.g., user profile, metadata).
   */
  data?: Record<string, unknown>;
}

/**
 * Props for rendering a single mention item in the typeahead menu.
 */
export interface MentionMenuItemProps {
  /**
   * The mention item to render.
   */
  item: MentionItem;

  /**
   * Index of the item in the list.
   */
  index: number;

  /**
   * Whether this item is currently selected/highlighted.
   */
  isSelected: boolean;

  /**
   * Callback to handle item click.
   */
  onClick: () => void;

  /**
   * Callback to handle mouse enter.
   */
  onMouseEnter: () => void;

  /**
   * Reference setter for the element (required for keyboard navigation).
   */
  setRefElement: (element: HTMLElement | null) => void;
}

/**
 * Props for rendering the mention menu container.
 */
export interface MentionMenuProps {
  /**
   * The anchor element to position the menu relative to.
   */
  anchorElement: HTMLElement | null;

  /**
   * List of mention items to display.
   */
  items: MentionItem[];

  /**
   * Index of the currently selected item.
   */
  selectedIndex: number | null;

  /**
   * Callback when an item is selected.
   */
  onSelectItem: (index: number) => void;

  /**
   * Callback when the highlighted item changes.
   */
  onHighlightItem: (index: number) => void;

  /**
   * Whether the menu is currently loading results.
   */
  isLoading?: boolean;

  /**
   * The current search query.
   */
  query: string | null;

  /**
   * Function to render each menu item.
   */
  renderItem?: (props: MentionMenuItemProps) => ReactNode;
}

/**
 * Configuration for the mention trigger behavior.
 */
export interface MentionTriggerConfig {
  /**
   * Character(s) that trigger the mention menu.
   * @default '@'
   */
  trigger?: string;

  /**
   * Minimum number of characters after trigger before searching.
   * @default 0
   */
  minLength?: number;

  /**
   * Maximum length of the mention query.
   * @default 75
   */
  maxLength?: number;

  /**
   * Characters that are allowed in mention queries.
   * @default alphanumeric + common punctuation
   */
  allowedChars?: RegExp;

  /**
   * Whether to allow spaces in mention queries.
   * @default true
   */
  allowSpaces?: boolean;
}

/**
 * Configuration for the MentionNode appearance.
 */
export interface MentionNodeConfig {
  /**
   * CSS class name applied to mention nodes.
   * @default 'typix-mention'
   */
  className?: string;

  /**
   * Inline styles applied to mention nodes.
   * @default undefined (uses className styling)
   */
  style?: string;

  /**
   * Whether to include the trigger character in the displayed text.
   * @default true
   */
  includeTrigger?: boolean;

  /**
   * Custom attributes to add to the mention DOM element.
   */
  attributes?: Record<string, string>;
}

/**
 * Search function type for fetching mention suggestions.
 */
export type MentionSearchFn = (
  query: string,
  trigger: string
) => Promise<MentionItem[]> | MentionItem[];

/**
 * Main configuration props for the MentionExtension.
 */
export interface MentionExtensionProps {
  /**
   * Function to search for mention suggestions.
   * Called with the query string (text after trigger).
   *
   * @example
   * ```tsx
   * onSearch={async (query) => {
   *   const response = await fetch(`/api/users?q=${query}`);
   *   return response.json();
   * }}
   * ```
   */
  onSearch: MentionSearchFn;

  /**
   * Callback when a mention is selected.
   *
   * @example
   * ```tsx
   * onSelect={(item) => console.log('Selected:', item)}
   * ```
   */
  onSelect?: (item: MentionItem) => void;

  /**
   * Callback when the mention menu opens.
   */
  onMenuOpen?: () => void;

  /**
   * Callback when the mention menu closes.
   */
  onMenuClose?: () => void;

  /**
   * Trigger configuration.
   */
  triggerConfig?: MentionTriggerConfig;

  /**
   * Node appearance configuration.
   */
  nodeConfig?: MentionNodeConfig;

  /**
   * Maximum number of suggestions to display.
   * @default 10
   */
  maxSuggestions?: number;

  /**
   * Debounce delay in milliseconds for search requests.
   * @default 200
   */
  debounceMs?: number;

  /**
   * Custom menu renderer for complete control over the dropdown UI.
   * If not provided, a default menu is rendered.
   *
   * @example
   * ```tsx
   * renderMenu={(props) => (
   *   <MyCustomMenu {...props} />
   * )}
   * ```
   */
  renderMenu?: (props: MentionMenuProps) => JSX.Element | null;

  /**
   * Custom menu item renderer.
   * Used when renderMenu is not provided.
   *
   * @example
   * ```tsx
   * renderMenuItem={(props) => (
   *   <div onClick={props.onClick}>
   *     <Avatar src={props.item.data?.avatar} />
   *     {props.item.name}
   *   </div>
   * )}
   * ```
   */
  renderMenuItem?: (props: MentionMenuItemProps) => ReactNode;

  /**
   * Content to show while loading results.
   * @default null (shows nothing)
   */
  loadingContent?: ReactNode;

  /**
   * Content to show when no results are found.
   * @default null (shows nothing)
   */
  emptyContent?: ReactNode;

  /**
   * Parent element for the menu portal.
   * @default document.body
   */
  menuPortalTarget?: HTMLElement | null;

  /**
   * Additional class name for the menu container.
   */
  menuClassName?: string;

  /**
   * Whether the extension is disabled.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Internal type for typeahead match result.
 */
export interface MentionMatch extends MenuTextMatch {
  trigger: string;
}

/**
 * Hook return type for useMentionSearch.
 */
export interface UseMentionSearchResult {
  results: MentionItem[];
  isLoading: boolean;
  error: Error | null;
}
