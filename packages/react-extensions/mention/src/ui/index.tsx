import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { TextNode } from "lexical";
import type { JSX, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as ReactDOM from "react-dom";

import {
  checkForMentionMatch,
  $createMentionNode,
  MentionNode,
} from "@typix-editor/extension-mention";
import type {
  MentionItem,
  MentionMenuItemProps,
  MentionSearchFn,
} from "@typix-editor/extension-mention";

// ============================================================================
// React-specific types
// ============================================================================

export interface MentionMenuProps {
  anchorElement: HTMLElement | null;
  items: MentionItem[];
  selectedIndex: number | null;
  onSelectItem: (index: number) => void;
  onHighlightItem: (index: number) => void;
  isLoading?: boolean;
  query: string | null;
  renderItem?: (props: MentionMenuItemProps) => ReactNode;
}

// Default values
const DEFAULT_TRIGGER = "@";
const DEFAULT_MIN_LENGTH = 0;
const DEFAULT_MAX_LENGTH = 75;
const DEFAULT_MAX_SUGGESTIONS = 10;
const DEFAULT_DEBOUNCE_MS = 200;

/**
 * Internal class for typeahead menu options.
 */
class MentionMenuOption extends MenuOption {
  item: MentionItem;

  constructor(item: MentionItem) {
    super(item.id);
    this.item = item;
  }
}

/**
 * Default menu item renderer.
 */
function DefaultMenuItem({
  item,
  index,
  isSelected,
  onClick,
  onMouseEnter,
  setRefElement,
}: MentionMenuItemProps): JSX.Element {
  const avatarSrc = item.data?.avatar as string | undefined;
  const subtitle = (item.data?.subtitle ?? item.data?.username) as
    | string
    | undefined;
  const initials = item.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <li
      aria-selected={isSelected}
      className={`typix-mention-menu__item ${isSelected ? "typix-mention-menu__item--selected" : ""}`}
      id={`typix-mention-item-${index}`}
      key={item.id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={setRefElement}
      role="option"
      tabIndex={-1}
    >
      <span className="typix-mention-menu__item-avatar">
        {avatarSrc ? (
          <img
            alt={item.name}
            className="typix-mention-menu__item-avatar-img"
            src={avatarSrc}
          />
        ) : (
          <span className="typix-mention-menu__item-avatar-initials">
            {initials}
          </span>
        )}
      </span>
      <span className="typix-mention-menu__item-info">
        <span className="typix-mention-menu__item-name">{item.name}</span>
        {subtitle && (
          <span className="typix-mention-menu__item-subtitle">{subtitle}</span>
        )}
      </span>
    </li>
  );
}

/**
 * Custom hook for debounced search.
 */
function useDebouncedSearch(
  query: string | null,
  trigger: string,
  onSearch: MentionSearchFn,
  debounceMs: number,
  maxSuggestions: number
): { results: MentionItem[]; isLoading: boolean } {
  const [results, setResults] = useState<MentionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortControllerRef = useRef<AbortController>(undefined);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query === null) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();

      try {
        const searchResults = await onSearch(query, trigger);
        setResults(searchResults.slice(0, maxSuggestions));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Mention search error:", error);
        }
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, trigger, onSearch, debounceMs, maxSuggestions]);

  return { results, isLoading };
}

// ============================================================================
// Props
// ============================================================================

export interface MentionUIProps {
  /**
   * Function to search for mention suggestions.
   */
  onSearch: MentionSearchFn;

  /**
   * Callback when a mention is selected.
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
  triggerConfig?: {
    trigger?: string;
    minLength?: number;
    maxLength?: number;
    allowSpaces?: boolean;
  };

  /**
   * Node appearance configuration.
   */
  nodeConfig?: {
    className?: string;
    style?: string;
    includeTrigger?: boolean;
    attributes?: Record<string, string>;
  };

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
   */
  renderMenu?: (props: MentionMenuProps) => JSX.Element | null;

  /**
   * Custom menu item renderer.
   */
  renderMenuItem?: (props: MentionMenuItemProps) => ReactNode;

  /**
   * Content to show while loading results.
   */
  loadingContent?: ReactNode;

  /**
   * Content to show when no results are found.
   */
  emptyContent?: ReactNode;

  /**
   * Parent element for the menu portal.
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

/** @deprecated Use MentionUIProps */
export type MentionExtensionProps = MentionUIProps;

// ============================================================================
// Component
// ============================================================================

/**
 * MentionUI - A flexible mention plugin for Typix/Lexical editors.
 *
 * Provides typeahead mention functionality with customizable triggers,
 * search handlers, and UI rendering.
 *
 * @example
 * ```tsx
 * <MentionUI
 *   onSearch={async (query) => {
 *     const response = await fetch(`/api/users?q=${query}`);
 *     return response.json();
 *   }}
 *   onSelect={(item) => console.log('Selected:', item)}
 *   triggerConfig={{ trigger: '@', minLength: 1 }}
 * />
 * ```
 */
export function MentionUI({
  onSearch,
  onSelect,
  onMenuOpen,
  onMenuClose,
  triggerConfig = {},
  nodeConfig = {},
  maxSuggestions = DEFAULT_MAX_SUGGESTIONS,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  renderMenu,
  renderMenuItem,
  loadingContent,
  emptyContent,
  menuPortalTarget,
  menuClassName,
  disabled = false,
}: MentionUIProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!editor.hasNodes([MentionNode])) {
      throw new Error(
        "MentionUI: MentionNode is not registered in the editor. " +
          "Make sure to include MentionNode in your editor config nodes array:\n\n" +
          'import { MentionNode } from "@typix-editor/extension-mention";\n\n' +
          "const editorConfig = {\n" +
          "  nodes: [MentionNode, ...otherNodes],\n" +
          "  // ... other config\n" +
          "};"
      );
    }
  }, [editor]);

  const trigger = triggerConfig.trigger ?? DEFAULT_TRIGGER;
  const minLength = triggerConfig.minLength ?? DEFAULT_MIN_LENGTH;
  const maxLength = triggerConfig.maxLength ?? DEFAULT_MAX_LENGTH;
  const allowSpaces = triggerConfig.allowSpaces ?? true;

  const { results, isLoading } = useDebouncedSearch(
    queryString,
    trigger,
    onSearch,
    debounceMs,
    maxSuggestions
  );

  const options = useMemo(
    () => results.map((item) => new MentionMenuOption(item)),
    [results]
  );

  useEffect(() => {
    if (results.length > 0 && !isMenuOpen) {
      setIsMenuOpen(true);
      onMenuOpen?.();
    } else if (results.length === 0 && isMenuOpen && !isLoading) {
      setIsMenuOpen(false);
      onMenuClose?.();
    }
  }, [results.length, isMenuOpen, isLoading, onMenuOpen, onMenuClose]);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionMenuOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const includeTrigger = nodeConfig.includeTrigger ?? false;
        const mentionNode = $createMentionNode({
          id: selectedOption.item.id,
          name: selectedOption.item.name,
          trigger: includeTrigger ? trigger : "",
          data: selectedOption.item.data,
        });

        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }

        mentionNode.select();
        closeMenu();
      });

      onSelect?.(selectedOption.item);
      setIsMenuOpen(false);
      onMenuClose?.();
    },
    [editor, trigger, nodeConfig.includeTrigger, onSelect, onMenuClose]
  );

  const checkForTriggerMatch = useCallback(
    (text: string): MenuTextMatch | null => {
      if (disabled) {
        return null;
      }
      return checkForMentionMatch(
        text,
        trigger,
        minLength,
        maxLength,
        allowSpaces
      );
    },
    [disabled, trigger, minLength, maxLength, allowSpaces]
  );

  if (disabled) {
    return null;
  }

  return (
    <LexicalTypeaheadMenuPlugin<MentionMenuOption>
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        const anchorElement = anchorElementRef.current;

        if (!anchorElement || (results.length === 0 && !isLoading)) {
          return null;
        }

        const menuProps: MentionMenuProps = {
          anchorElement: menuPortalTarget ?? anchorElement,
          items: results,
          selectedIndex,
          onSelectItem: (index: number) => {
            setHighlightedIndex(index);
            selectOptionAndCleanUp(options[index]);
          },
          onHighlightItem: setHighlightedIndex,
          isLoading,
          query: queryString,
          renderItem: renderMenuItem,
        };

        if (renderMenu) {
          return renderMenu(menuProps);
        }

        return ReactDOM.createPortal(
          <div className={`typix-mention-menu ${menuClassName ?? ""}`}>
            {isLoading && loadingContent ? (
              loadingContent
            ) : isLoading ? (
              <div className="typix-mention-menu__loading">Loading...</div>
            ) : results.length === 0 && emptyContent ? (
              emptyContent
            ) : results.length === 0 ? null : (
              <ul className="typix-mention-menu__list" role="listbox">
                {options.map((option, index) => {
                  const itemProps: MentionMenuItemProps = {
                    item: option.item,
                    index,
                    isSelected: selectedIndex === index,
                    onClick: () => {
                      setHighlightedIndex(index);
                      selectOptionAndCleanUp(option);
                    },
                    onMouseEnter: () => {
                      setHighlightedIndex(index);
                    },
                    setRefElement: option.setRefElement,
                  };

                  if (renderMenuItem) {
                    return (
                      <li
                        aria-selected={selectedIndex === index}
                        key={option.item.id}
                        role="option"
                      >
                        {renderMenuItem(itemProps)}
                      </li>
                    );
                  }

                  return (
                    <DefaultMenuItem key={option.item.id} {...itemProps} />
                  );
                })}
              </ul>
            )}
          </div>,
          anchorElement
        );
      }}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={checkForTriggerMatch}
    />
  );
}

MentionUI.displayName = "Typix.MentionUI";
