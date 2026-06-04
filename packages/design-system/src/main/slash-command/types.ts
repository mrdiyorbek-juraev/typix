import type { ComponentType } from "react";
import type { SuggestionItem } from "@typix-editor/react";
import type { TypixEditor } from "@typix-editor/core";

// ─── Item types ───────────────────────────────────────────────────────────────

export type SlashMenuItemType =
  | "text"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bullet_list"
  | "ordered_list"
  | "quote"
  | "code_block";

export interface SlashMenuItem {
  /** Identifier used for enabledItems filtering. */
  type: SlashMenuItemType | string;
  /** Display title shown in the menu. */
  title: string;
  /** Secondary description text shown below the title. */
  subtext?: string;
  /** Search aliases (matched in addition to title). */
  aliases?: string[];
  /** Icon component (e.g. lucide-react icon). */
  badge?: ComponentType<{ className?: string; size?: number }>;
  /** Group name for grouping display. */
  group?: string;
  /** Action to run when item is selected. */
  onSelect: (ctx: { editor: TypixEditor["_lexical"] }) => void;
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface SlashMenuConfig {
  /**
   * Which built-in item types to show.
   * Defaults to all built-in items.
   */
  enabledItems?: SlashMenuItemType[];
  /** Additional custom items to append. */
  customItems?: SlashMenuItem[];
  /**
   * Override group assignment for item types.
   * Record<itemType, groupName>
   */
  itemGroups?: Record<string, string>;
  /**
   * Whether to show group labels.
   * @default true
   */
  showGroups?: boolean;
}

// ─── Component props ─────────────────────────────────────────────────────────

export interface SlashDropdownMenuProps {
  /** Config for enabled items, groups, and custom items. */
  config?: SlashMenuConfig;
  /** Additional CSS class for the dropdown container. */
  className?: string;
  /** Disable the entire menu. @default false */
  disabled?: boolean;
  /** Callback when an item is selected. */
  onSelect?: (item: SlashMenuItem) => void;
  /** Callback when the menu opens. */
  onOpen?: () => void;
  /** Callback when the menu closes. */
  onClose?: () => void;
  /** Custom empty state content. */
  emptyContent?: React.ReactNode;
}

// ─── Hook return ─────────────────────────────────────────────────────────────

export interface UseSlashDropdownMenuReturn {
  /** Returns all visible menu items, respecting config, filtered by query. */
  getSlashMenuItems: (query: string | null) => SlashMenuItem[];
  /** Returns SuggestionItem-compatible items for use with SuggestionMenu. */
  getSuggestionItems: (props: {
    query: string;
    editor: TypixEditor["_lexical"];
  }) => SuggestionItem<SlashMenuItem>[];
  /** The resolved config. */
  config: {
    enabledItems: SlashMenuItemType[] | undefined;
    customItems: SlashMenuItem[] | undefined;
    itemGroups: Record<string, string> | undefined;
    showGroups: boolean;
  };
}
