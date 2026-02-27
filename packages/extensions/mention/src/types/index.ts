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
 * Typeahead match result for mention triggers.
 */
export interface MentionMatch {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
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
