import { useCallback, useMemo } from "react";
import {
  $createHeadingNode,
  $createQuoteNode,
} from "@typix-editor/core/lexical/rich-text";
import { $createCodeNode } from "@typix-editor/core/lexical/code";
import {
  $createListNode,
  $createListItemNode,
} from "@typix-editor/core/lexical/list";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
// import type { LexicalEditor } from "lexical";
import type {
  SuggestionItem,
  SuggestionSelectProps,
} from "@typix-editor/react";
import {
  AlignLeft,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
} from "lucide-react";
import type {
  SlashMenuConfig,
  SlashMenuItem,
  SlashMenuItemType,
  UseSlashDropdownMenuReturn,
} from "../types";
import { $createParagraphNode, $getSelection, $isRangeSelection, type TypixEditor } from "@typix-editor/core";

// ─── Default group assignments ────────────────────────────────────────────────

const DEFAULT_GROUPS: Record<SlashMenuItemType, string> = {
  text: "Style",
  heading_1: "Style",
  heading_2: "Style",
  heading_3: "Style",
  bullet_list: "Lists",
  ordered_list: "Lists",
  quote: "Blocks",
  code_block: "Blocks",
};

// ─── Built-in item definitions ────────────────────────────────────────────────

function buildBuiltInItems(
  itemGroups?: Record<string, string>
): SlashMenuItem[] {
  const group = (type: SlashMenuItemType) =>
    itemGroups?.[type] ?? DEFAULT_GROUPS[type];

  return [
    {
      type: "text",
      title: "Text",
      subtext: "Start writing plain text",
      aliases: ["paragraph", "p", "plain"],
      badge: AlignLeft,
      group: group("text"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        });
      },
    },
    {
      type: "heading_1",
      title: "Heading 1",
      subtext: "Large section heading",
      aliases: ["h1", "heading", "title"],
      badge: Heading1,
      group: group("heading_1"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h1"));
          }
        });
      },
    },
    {
      type: "heading_2",
      title: "Heading 2",
      subtext: "Medium section heading",
      aliases: ["h2", "heading", "subtitle"],
      badge: Heading2,
      group: group("heading_2"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h2"));
          }
        });
      },
    },
    {
      type: "heading_3",
      title: "Heading 3",
      subtext: "Small section heading",
      aliases: ["h3", "heading"],
      badge: Heading3,
      group: group("heading_3"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h3"));
          }
        });
      },
    },
    {
      type: "bullet_list",
      title: "Bullet List",
      subtext: "Create an unordered list",
      aliases: ["ul", "unordered", "list", "bullet"],
      badge: List,
      group: group("bullet_list"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => {
              const list = $createListNode("bullet");
              list.append($createListItemNode());
              return list;
            });
          }
        });
      },
    },
    {
      type: "ordered_list",
      title: "Numbered List",
      subtext: "Create an ordered list",
      aliases: ["ol", "ordered", "numbered", "number"],
      badge: ListOrdered,
      group: group("ordered_list"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => {
              const list = $createListNode("number");
              list.append($createListItemNode());
              return list;
            });
          }
        });
      },
    },
    {
      type: "quote",
      title: "Blockquote",
      subtext: "Insert a quote block",
      aliases: ["blockquote", "callout", ">"],
      badge: Quote,
      group: group("quote"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
      },
    },
    {
      type: "code_block",
      title: "Code Block",
      subtext: "Insert a code block",
      aliases: ["code", "pre", "```"],
      badge: Code2,
      group: group("code_block"),
      onSelect: ({ editor }: { editor: TypixEditor["_lexical"] }) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createCodeNode());
          }
        });
      },
    },
  ];
}

// ─── SuggestionItem bridge ────────────────────────────────────────────────────

function toSuggestionItem(item: SlashMenuItem): SuggestionItem<SlashMenuItem> {
  return {
    title: item.title,
    subtext: item.subtext,
    badge: item.badge,
    group: item.group,
    keywords: item.aliases,
    context: item,
    onSelect: ({
      editor,
      nodeToRemove,
    }: SuggestionSelectProps<SlashMenuItem>) => {
      if (nodeToRemove) nodeToRemove.remove();
      item.onSelect({ editor });
    },
  };
}

// ─── Query filter ─────────────────────────────────────────────────────────────

function matchesQuery(item: SlashMenuItem, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (item.title.toLowerCase().includes(q)) return true;
  if (item.subtext?.toLowerCase().includes(q)) return true;
  if (item.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
  return false;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSlashDropdownMenu(
  config: SlashMenuConfig = {}
): UseSlashDropdownMenuReturn {
  const { enabledItems, customItems, itemGroups, showGroups = true } = config;

  const allBuiltIn = useMemo(() => buildBuiltInItems(itemGroups), [itemGroups]);

  const visibleBuiltIn = useMemo(() => {
    if (!enabledItems) return allBuiltIn;
    return allBuiltIn.filter((item) =>
      enabledItems?.includes(item.type as SlashMenuItemType)
    );
  }, [allBuiltIn, enabledItems]);

  // FIX: pre-concat once so getSlashMenuItems never spreads on every call
  const allItems = useMemo(
    () =>
      customItems?.length
        ? [...visibleBuiltIn, ...customItems]
        : visibleBuiltIn,
    [visibleBuiltIn, customItems]
  );

  const getSlashMenuItems = useCallback(
    (query: string | null): SlashMenuItem[] => {
      if (!query) return allItems;
      return allItems.filter((item) => matchesQuery(item, query));
    },
    [allItems]
  );

  const getSuggestionItems = useCallback(
    ({
      query,
    }: {
      query: string;
      editor: TypixEditor["_lexical"];
    }): SuggestionItem<SlashMenuItem>[] => {
      return getSlashMenuItems(query).map(toSuggestionItem);
    },
    [getSlashMenuItems]
  );

  return {
    getSlashMenuItems,
    getSuggestionItems,
    config: {
      enabledItems,
      customItems,
      itemGroups,
      showGroups,
    },
  };
}
