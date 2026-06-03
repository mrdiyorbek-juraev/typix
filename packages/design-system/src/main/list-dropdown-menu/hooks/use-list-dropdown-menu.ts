import type { TypixEditor } from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import { List } from "lucide-react";
import { useIsApple } from "../../../lib/use-is-apple";
import { LIST_CONFIG } from "../../list-button/hooks/use-list";
import type { ListType } from "../../list-button/types";
import type {
  UseListDropdownMenuOptions,
  UseListDropdownMenuReturn,
  ListItemConfig,
} from "../types";

const ALL_TYPES: ListType[] = ["bullet", "ordered", "check"];

export function useListDropdownMenu(
  options?: UseListDropdownMenuOptions
): UseListDropdownMenuReturn {
  const editor = useTypixEditorState();
  const isApple = useIsApple();
  const types = options?.types ?? ALL_TYPES;

  const items: ListItemConfig[] = types.map((type) => {
    const config = LIST_CONFIG[type];
    const isActive = editor.isActive(config.activeName);
    const canToggle = config.canApply(editor.can()).run();

    return {
      type,
      label: config.label,
      shortcutKeys: isApple ? config.macKeys : config.winKeys,
      Icon: config.Icon,
      isActive,
      canToggle,
      handleToggle: () => {
        config.apply(editor.chain().focus()).run();
      },
    };
  });

  const activeItem = items.find((item) => item.isActive);
  const canToggle = items.some((item) => item.canToggle);
  const isVisible = !options?.hideWhenUnavailable || canToggle;

  return {
    isVisible,
    isActive: !!activeItem,
    activeType: activeItem?.type ?? null,
    canToggle,
    items,
    label: activeItem?.label ?? "List",
    Icon: activeItem?.Icon ?? List,
  };
}

// --- Utility functions ---

export function isAnyListActive(
  editor: TypixEditor,
  types: ListType[] = ALL_TYPES
): boolean {
  return types.some((type) => editor.isActive(LIST_CONFIG[type].activeName));
}

export function canToggleAnyList(
  editor: TypixEditor,
  types: ListType[] = ALL_TYPES
): boolean {
  return types.some((type) => LIST_CONFIG[type].canApply(editor.can()).run());
}

export function getActiveListType(
  editor: TypixEditor,
  types: ListType[] = ALL_TYPES
): ListType | null {
  return (
    types.find((type) => editor.isActive(LIST_CONFIG[type].activeName)) ?? null
  );
}
