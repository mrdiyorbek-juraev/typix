"use client";

import type { JSX } from "react";
import { memo, useCallback, useRef, useMemo } from "react";
import {
  SuggestionMenu,
  type SuggestionItem,
  type SuggestionMenuRenderProps,
} from "@typix-editor/react";
import { cn } from "../../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../primitives/command";
import type { SlashDropdownMenuProps, SlashMenuItem } from "../types";
import { useSlashDropdownMenu } from "../hooks/use-slash-dropdown-menu";

// ─── Group items by their group label ────────────────────────────────────────

function groupItems(
  items: SuggestionItem<SlashMenuItem>[]
): Map<string, SuggestionItem<SlashMenuItem>[]> {
  const map = new Map<string, SuggestionItem<SlashMenuItem>[]>();
  for (const item of items) {
    const g = item.group ?? "Other";
    const existing = map.get(g);
    if (existing) {
      existing.push(item);
    } else {
      map.set(g, [item]);
    }
  }
  return map;
}

// ─── Inner UI component ─────────────────────────────────────────────────────

interface SlashDropdownUIProps
  extends SuggestionMenuRenderProps<SlashMenuItem> {
  className?: string;
  showGroups: boolean;
  onItemSelect?: (item: SlashMenuItem) => void;
  emptyContent?: React.ReactNode;
  animate?: boolean;
}

function SlashDropdownUI({
  items,
  selectedIndex,
  onSelect,
  className,
  showGroups,
  onItemSelect,
  emptyContent,
  animate = true,
}: SlashDropdownUIProps) {
  const groupedEntries = useMemo(
    () => (showGroups ? Array.from(groupItems(items).entries()) : null),
    [items, showGroups]
  );

  const handleItemSelect = useCallback(
    (item: SuggestionItem<SlashMenuItem>) => {
      onSelect(item);
      if (onItemSelect && item.context) {
        onItemSelect(item.context);
      }
    },
    [onSelect, onItemSelect]
  );

  let itemIndex = -1;

  return (
    <div
      role="dialog"
      aria-label="Slash command menu"
      className={cn(
        "typix-slash-menu",
        "z-50 w-[260px]",
        "rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
        animate && "animate-in fade-in-0 zoom-in-95 duration-150",
        className
      )}
    >
      <Command shouldFilter={false}>
        <CommandList className="max-h-[300px]">
          {items.length === 0 ? (
            emptyContent ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyContent}
              </div>
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )
          ) : groupedEntries ? (
            groupedEntries.map(([groupName, groupItems], groupIdx) => (
              <span key={groupName}>
                {groupIdx > 0 && <CommandSeparator />}
                <CommandGroup heading={groupName}>
                  {groupItems.map((item) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <SlashMenuItemRow
                        key={item.context?.type ?? item.title}
                        item={item}
                        isHighlighted={idx === selectedIndex}
                        onSelect={handleItemSelect}
                      />
                    );
                  })}
                </CommandGroup>
              </span>
            ))
          ) : (
            <CommandGroup>
              {items.map((item, idx) => (
                <SlashMenuItemRow
                  key={item.context?.type ?? item.title}
                  item={item}
                  isHighlighted={idx === selectedIndex}
                  onSelect={handleItemSelect}
                />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * SlashDropdownMenu
 *
 * A fully accessible slash command dropdown menu built on SuggestionMenu.
 * Detects when the user types "/" and renders a filterable command palette
 * near the cursor.
 *
 * Must be rendered inside an `<EditorRoot>`.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <SlashDropdownMenu
 *     config={{
 *       enabledItems: ['text', 'heading_1', 'heading_2', 'bullet_list'],
 *       showGroups: true,
 *     }}
 *   />
 * </EditorRoot>
 * ```
 */
export function SlashDropdownMenu({
  config: userConfig,
  className,
  disabled = false,
  onSelect,
  onOpen,
  onClose,
  emptyContent,
}: SlashDropdownMenuProps): JSX.Element | null {
  const { getSuggestionItems, config: resolvedConfig } =
    useSlashDropdownMenu(userConfig);

  // Track open/close via render prop calls
  const wasOpenRef = useRef(false);
  // Only animate on the first render after menu opens — Lexical's typeahead
  // plugin detaches/re-attaches the anchor element on every keystroke, which
  // restarts CSS animations and causes a visible flicker.
  const hasAnimatedRef = useRef(false);

  const handleRender = useCallback(
    (renderProps: SuggestionMenuRenderProps<SlashMenuItem>) => {
      const isOpen = renderProps.items.length > 0 || renderProps.query !== null;
      if (isOpen && !wasOpenRef.current) {
        onOpen?.();
        hasAnimatedRef.current = false;
      }
      if (!isOpen && wasOpenRef.current) onClose?.();
      wasOpenRef.current = isOpen;

      const shouldAnimate = !hasAnimatedRef.current;
      hasAnimatedRef.current = true;

      return (
        <SlashDropdownUI
          {...renderProps}
          className={className}
          showGroups={resolvedConfig.showGroups}
          onItemSelect={onSelect}
          emptyContent={emptyContent}
          animate={shouldAnimate}
        />
      );
    },
    [
      className,
      resolvedConfig.showGroups,
      onSelect,
      onOpen,
      onClose,
      emptyContent,
    ]
  );

  return (
    <SuggestionMenu<SlashMenuItem>
      char="/"
      items={getSuggestionItems}
      startOfLine
      allowedPrefixes={null}
      disabled={disabled}
    >
      {handleRender}
    </SuggestionMenu>
  );
}

SlashDropdownMenu.displayName = "Typix.SlashDropdownMenu";

// ─── Row sub-component ────────────────────────────────────────────────────────

interface SlashMenuItemRowProps {
  item: SuggestionItem<SlashMenuItem>;
  isHighlighted: boolean;
  onSelect: (item: SuggestionItem<SlashMenuItem>) => void;
}

const SlashMenuItemRow = memo(function SlashMenuItemRow({
  item,
  isHighlighted,
  onSelect,
}: SlashMenuItemRowProps) {
  const Icon = item.badge as
    | React.ComponentType<{ className?: string; size?: number }>
    | undefined;
  return (
    <CommandItem
      data-highlighted={isHighlighted}
      aria-selected={isHighlighted}
      value={item.context?.type ?? item.title}
      onSelect={() => onSelect(item)}
      className={cn(
        "flex items-center gap-2.5 px-2 py-1.5 cursor-pointer",
        isHighlighted && "bg-accent text-accent-foreground"
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-sm border border-border bg-background",
            isHighlighted && "border-accent-foreground/20"
          )}
        >
          <Icon size={14} className="text-foreground/70" />
        </span>
      )}
      <span className="flex flex-col min-w-0">
        <span className="text-sm font-medium leading-none truncate">
          {item.title}
        </span>
        {item.subtext && (
          <span className="text-xs text-muted-foreground mt-0.5 truncate">
            {item.subtext}
          </span>
        )}
      </span>
    </CommandItem>
  );
});
