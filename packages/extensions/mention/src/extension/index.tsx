import type { JSX, ReactNode } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    LexicalTypeaheadMenuPlugin,
    MenuOption,
    type MenuTextMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode, MentionNode } from '../node';
import type {
    MentionExtensionProps,
    MentionItem,
    MentionMatch,
    MentionMenuItemProps,
    MentionMenuProps,
} from '../types';

// Default values
const DEFAULT_TRIGGER = '@';
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
 * Build regex for matching mention triggers.
 */
function buildMentionRegex(
    trigger: string,
    maxLength: number,
    allowSpaces: boolean,
): RegExp {
    const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const punctuation = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';

    // Characters allowed in mention (everything except trigger, punctuation, and maybe spaces)
    const validChars = allowSpaces
        ? `[^${escapedTrigger}${punctuation}]`
        : `[^${escapedTrigger}${punctuation}\\s]`;

    // Allow spaces within the mention if configured
    const validJoins = allowSpaces
        ? `(?:\\.[ |$]| |[${punctuation}]|)`
        : `(?:[${punctuation}]|)`;

    return new RegExp(
        `(^|\\s|\\()([${escapedTrigger}]((?:${validChars}${validJoins}){0,${maxLength}}))$`,
    );
}

/**
 * Check for mention trigger match in text.
 */
function checkForMentionMatch(
    text: string,
    trigger: string,
    minLength: number,
    maxLength: number,
    allowSpaces: boolean,
): MentionMatch | null {
    const regex = buildMentionRegex(trigger, maxLength, allowSpaces);
    const match = regex.exec(text);

    if (match !== null) {
        const maybeLeadingWhitespace = match[1];
        const matchingString = match[3];

        if (matchingString.length >= minLength) {
            return {
                leadOffset: match.index + maybeLeadingWhitespace.length,
                matchingString,
                replaceableString: match[2],
                trigger,
            };
        }
    }

    return null;
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
    return (
        <li
            key={item.id}
            tabIndex={-1}
            className={`typix-mention-menu-item ${isSelected ? 'typix-mention-menu-item--selected' : ''}`}
            ref={setRefElement}
            role="option"
            aria-selected={isSelected}
            id={`typix-mention-item-${index}`}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            <span className="typix-mention-menu-item-name">{item.name}</span>
        </li>
    );
}

/**
 * Default menu renderer.
 */
function DefaultMenu({
    anchorElement,
    items,
    selectedIndex,
    onSelectItem,
    onHighlightItem,
    isLoading,
    query,
    renderItem,
}: MentionMenuProps & { options: MentionMenuOption[] }): JSX.Element | null {
    if (!anchorElement) {
        return null;
    }

    const ItemRenderer = renderItem || DefaultMenuItem;

    return ReactDOM.createPortal(
        <div className="typix-mention-menu">
            {isLoading ? (
                <div className="typix-mention-menu-loading">Loading...</div>
            ) : items.length === 0 ? (
                query ? (
                    <div className="typix-mention-menu-empty">No results found</div>
                ) : null
            ) : (
                <ul className="typix-mention-menu-list" role="listbox">
                    {items.map((item, index) => (
                        <ItemRenderer
                            key={item.id}
                            item={item}
                            index={index}
                            isSelected={selectedIndex === index}
                            onClick={() => onSelectItem(index)}
                            onMouseEnter={() => onHighlightItem(index)}
                            setRefElement={() => { }}
                        />
                    ))}
                </ul>
            )}
        </div>,
        anchorElement,
    );
}

/**
 * Custom hook for debounced search.
 */
function useDebouncedSearch(
    query: string | null,
    trigger: string,
    onSearch: MentionExtensionProps['onSearch'],
    debounceMs: number,
    maxSuggestions: number,
): { results: MentionItem[]; isLoading: boolean } {
    const [results, setResults] = useState<MentionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const abortControllerRef = useRef<AbortController>(undefined);

    useEffect(() => {
        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Abort previous request
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
                // Ignore abort errors
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Mention search error:', error);
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

/**
 * MentionExtension - A flexible mention plugin for Typix/Lexical editors.
 *
 * Provides typeahead mention functionality with customizable triggers,
 * search handlers, and UI rendering.
 *
 * @example
 * ```tsx
 * <MentionExtension
 *   onSearch={async (query) => {
 *     const response = await fetch(`/api/users?q=${query}`);
 *     return response.json();
 *   }}
 *   onSelect={(item) => console.log('Selected:', item)}
 *   triggerConfig={{ trigger: '@', minLength: 1 }}
 * />
 * ```
 */
export function MentionExtension({
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
}: MentionExtensionProps): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const [queryString, setQueryString] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Validate that MentionNode is registered
    useEffect(() => {
        if (!editor.hasNodes([MentionNode])) {
            throw new Error(
                'MentionExtension: MentionNode is not registered in the editor. ' +
                'Make sure to include MentionNode in your editor config nodes array:\n\n' +
                'import { MentionNode } from "@typix-editor/mention";\n\n' +
                'const editorConfig = {\n' +
                '  nodes: [MentionNode, ...otherNodes],\n' +
                '  // ... other config\n' +
                '};'
            );
        }
    }, [editor]);

    // Extract trigger config with defaults
    const trigger = triggerConfig.trigger ?? DEFAULT_TRIGGER;
    const minLength = triggerConfig.minLength ?? DEFAULT_MIN_LENGTH;
    const maxLength = triggerConfig.maxLength ?? DEFAULT_MAX_LENGTH;
    const allowSpaces = triggerConfig.allowSpaces ?? true;

    // Debounced search
    const { results, isLoading } = useDebouncedSearch(
        queryString,
        trigger,
        onSearch,
        debounceMs,
        maxSuggestions,
    );

    // Convert results to menu options
    const options = useMemo(
        () => results.map((item) => new MentionMenuOption(item)),
        [results],
    );

    // Handle menu open/close
    useEffect(() => {
        if (results.length > 0 && !isMenuOpen) {
            setIsMenuOpen(true);
            onMenuOpen?.();
        } else if (results.length === 0 && isMenuOpen && !isLoading) {
            setIsMenuOpen(false);
            onMenuClose?.();
        }
    }, [results.length, isMenuOpen, isLoading, onMenuOpen, onMenuClose]);

    // Handle option selection
    const onSelectOption = useCallback(
        (
            selectedOption: MentionMenuOption,
            nodeToReplace: TextNode | null,
            closeMenu: () => void,
        ) => {
            editor.update(() => {
                const includeTrigger = nodeConfig.includeTrigger ?? false;
                const mentionNode = $createMentionNode({
                    id: selectedOption.item.id,
                    name: selectedOption.item.name,
                    trigger: includeTrigger ? trigger : '',
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
        [editor, trigger, nodeConfig.includeTrigger, onSelect, onMenuClose],
    );

    // Check for trigger match
    const checkForTriggerMatch = useCallback(
        (text: string): MenuTextMatch | null => {
            if (disabled) {
                return null;
            }
            return checkForMentionMatch(text, trigger, minLength, maxLength, allowSpaces);
        },
        [disabled, trigger, minLength, maxLength, allowSpaces],
    );

    if (disabled) {
        return null;
    }

    return (
        <LexicalTypeaheadMenuPlugin<MentionMenuOption>
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForTriggerMatch}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
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

                // Use custom renderer if provided
                if (renderMenu) {
                    return renderMenu(menuProps);
                }

                // Default menu rendering
                return ReactDOM.createPortal(
                    <div className={`typix-mention-menu ${menuClassName ?? ''}`}>
                        {isLoading && loadingContent ? (
                            loadingContent
                        ) : isLoading ? (
                            <div className="typix-mention-menu-loading">Loading...</div>
                        ) : results.length === 0 && emptyContent ? (
                            emptyContent
                        ) : results.length === 0 ? (
                            null
                        ) : (
                            <ul className="typix-mention-menu-list" role="listbox">
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
                                            <li key={option.item.id} role="option" aria-selected={selectedIndex === index}>
                                                {renderMenuItem(itemProps)}
                                            </li>
                                        );
                                    }

                                    return <DefaultMenuItem key={option.item.id} {...itemProps} />;
                                })}
                            </ul>
                        )}
                    </div>,
                    anchorElement,
                );
            }}
        />
    );
}

MentionExtension.displayName = 'Typix.MentionExtension';

export type { MentionExtensionProps };
