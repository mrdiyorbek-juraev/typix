export interface FontFamilyItem {
  label: string;
  value: string;
}

export interface UseFontFamilyDropdownMenuOptions {
  families?: FontFamilyItem[];
  hideWhenUnavailable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface UseFontFamilyDropdownMenuReturn {
  isVisible: boolean;
  currentFamily: string;
  currentLabel: string;
  items: FontFamilyItem[];
  handleSelect: (value: string) => void;
}

export interface FontFamilyDropdownMenuProps {
  families?: FontFamilyItem[];
  hideWhenUnavailable?: boolean;
  portal?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}
