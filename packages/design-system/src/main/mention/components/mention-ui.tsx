import type { JSX, ReactNode } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import * as ReactDOM from "react-dom"
import type { TextNode } from "lexical"
import {
  useTypixEditor,
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
} from "@typix-editor/react"
import {
  checkForMentionMatch,
  $createMentionNode,
  MentionNode,
} from "@typix-editor/extension-mention"
import type {
  MentionItem,
  MentionMenuItemProps,
} from "@typix-editor/extension-mention"
import { cn } from "../../../lib/utils"
import { Skeleton } from "../../../primitives/skeleton"
import { useDebouncedSearch } from "../hooks/use-debounced-search"
import { DefaultMenuItem } from "./default-menu-item"
import type { MentionMenuProps, MentionUIProps } from "../types"

// Default values
const DEFAULT_TRIGGER = "@"
const DEFAULT_MIN_LENGTH = 0
const DEFAULT_MAX_LENGTH = 75
const DEFAULT_MAX_SUGGESTIONS = 10
const DEFAULT_DEBOUNCE_MS = 200

class MentionMenuOption extends MenuOption {
  item: MentionItem

  constructor(item: MentionItem) {
    super(item.id)
    this.item = item
  }
}

/**
 * MentionUI
 *
 * Provides typeahead mention functionality with customizable triggers,
 * search handlers, and UI rendering.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <MentionUI
 *     onSearch={async (query) => {
 *       const response = await fetch(`/api/users?q=${query}`);
 *       return response.json();
 *     }}
 *   />
 * </EditorRoot>
 * ```
 */
export function MentionUI({
  onSearch,
  onSelect,
  onMenuOpen,
  onMenuClose,
  triggerConfig = {},
  includeTrigger = true,
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
  const typixEditor = useTypixEditor()
  const editor = typixEditor.lexical
  const [queryString, setQueryString] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!editor.hasNodes([MentionNode])) {
      throw new Error(
        "MentionUI: MentionNode is not registered in the editor. " +
          "Make sure to include MentionExtension() in your extensions array."
      )
    }
  }, [editor])

  const trigger = triggerConfig.trigger ?? DEFAULT_TRIGGER
  const minLength = triggerConfig.minLength ?? DEFAULT_MIN_LENGTH
  const maxLength = triggerConfig.maxLength ?? DEFAULT_MAX_LENGTH
  const allowSpaces = triggerConfig.allowSpaces ?? true

  const { results, isLoading } = useDebouncedSearch(
    queryString,
    trigger,
    onSearch,
    debounceMs,
    maxSuggestions
  )

  const options = useMemo(
    () => results.map((item) => new MentionMenuOption(item)),
    [results]
  )

  useEffect(() => {
    if (results.length > 0 && !isMenuOpen) {
      setIsMenuOpen(true)
      onMenuOpen?.()
    } else if (results.length === 0 && isMenuOpen && !isLoading) {
      setIsMenuOpen(false)
      onMenuClose?.()
    }
  }, [results.length, isMenuOpen, isLoading, onMenuOpen, onMenuClose])

  const onSelectOption = useCallback(
    (
      selectedOption: MentionMenuOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode({
          id: selectedOption.item.id,
          name: selectedOption.item.name,
          trigger: includeTrigger ? trigger : "",
          data: selectedOption.item.data,
        })

        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }

        mentionNode.select()
        closeMenu()
      })

      onSelect?.(selectedOption.item)
      setIsMenuOpen(false)
      onMenuClose?.()
    },
    [editor, trigger, includeTrigger, onSelect, onMenuClose]
  )

  const checkForTriggerMatch = useCallback(
    (text: string): MenuTextMatch | null => {
      if (disabled) {
        return null
      }
      return checkForMentionMatch(
        text,
        trigger,
        minLength,
        maxLength,
        allowSpaces
      )
    },
    [disabled, trigger, minLength, maxLength, allowSpaces]
  )

  if (disabled) {
    return null
  }

  return (
    <LexicalTypeaheadMenuPlugin<MentionMenuOption>
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        const anchorElement = anchorElementRef.current

        if (!anchorElement || (results.length === 0 && !isLoading)) {
          return null
        }

        const menuProps: MentionMenuProps = {
          anchorElement: menuPortalTarget ?? anchorElement,
          items: results,
          selectedIndex,
          onSelectItem: (index: number) => {
            const option = options[index]
            if (!option) return
            setHighlightedIndex(index)
            selectOptionAndCleanUp(option)
          },
          onHighlightItem: setHighlightedIndex,
          isLoading,
          query: queryString,
          renderItem: renderMenuItem,
        }

        if (renderMenu) {
          return renderMenu(menuProps)
        }

        return ReactDOM.createPortal(
          <div
            className={cn(
              "absolute z-50 max-h-[300px] min-w-[220px] overflow-y-auto",
              "rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              menuClassName,
            )}
          >
            {isLoading && loadingContent ? (
              loadingContent
            ) : isLoading ? (
              <div className="space-y-1.5 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ) : results.length === 0 && emptyContent ? (
              emptyContent
            ) : results.length === 0 ? null : (
              <ul className="list-none m-0 p-1" role="listbox">
                {options.map((option, index) => {
                  const itemProps: MentionMenuItemProps = {
                    item: option.item,
                    index,
                    isSelected: selectedIndex === index,
                    onClick: () => {
                      setHighlightedIndex(index)
                      selectOptionAndCleanUp(option)
                    },
                    onMouseEnter: () => {
                      setHighlightedIndex(index)
                    },
                    setRefElement: option.setRefElement,
                  }

                  if (renderMenuItem) {
                    return (
                      <li
                        aria-selected={selectedIndex === index}
                        key={option.item.id}
                        role="option"
                      >
                        {renderMenuItem(itemProps)}
                      </li>
                    )
                  }

                  return (
                    <DefaultMenuItem key={option.item.id} {...itemProps} />
                  )
                })}
              </ul>
            )}
          </div>,
          anchorElement
        )
      }}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={options}
      triggerFn={checkForTriggerMatch}
    />
  )
}

MentionUI.displayName = "Typix.MentionUI"
