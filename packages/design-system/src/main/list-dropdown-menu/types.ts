import type { FC } from "react";
import type { ListType } from "../list-button/types";

export type { ListType };

export interface UseListDropdownMenuOptions {
  types?: ListType[];
  hideWhenUnavailable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface ListItemConfig {
  type: ListType;
  label: string;
  shortcutKeys: string[];
  Icon: FC;
  isActive: boolean;
  canToggle: boolean;
  handleToggle: () => void;
}

export interface UseListDropdownMenuReturn {
  isVisible: boolean;
  isActive: boolean;
  activeType: ListType | null;
  canToggle: boolean;
  items: ListItemConfig[];
  label: string;
  Icon: FC;
}

export interface ListDropdownMenuProps {
  types?: ListType[];
  hideWhenUnavailable?: boolean;
  portal?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}
