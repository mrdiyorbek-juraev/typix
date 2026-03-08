import { useTypixEditorState, useSignal } from "@typix-editor/react";
import { getFontFamilyState } from "@typix-editor/extension-starter-kit";
import type {
  FontFamilyItem,
  UseFontFamilyDropdownMenuOptions,
  UseFontFamilyDropdownMenuReturn,
} from "../types";

const DEFAULT_FAMILIES: FontFamilyItem[] = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Monospace", value: "monospace" },
];

export function useFontFamilyDropdownMenu(
  options?: UseFontFamilyDropdownMenuOptions,
): UseFontFamilyDropdownMenuReturn {
  const editor = useTypixEditorState();
  const state = getFontFamilyState(editor.lexical);
  const currentFamily = useSignal(state!.currentFamily);

  const items = options?.families ?? DEFAULT_FAMILIES;

  const activeItem = items.find((item) => item.value === currentFamily);
  const currentLabel = activeItem?.label ?? (currentFamily || "Default");

  const isVisible = !options?.hideWhenUnavailable || !!state;

  const handleSelect = (value: string) => {
    if (value) {
      editor.chain().focus().setFontFamily({ family: value }).run();
    } else {
      editor.chain().focus().resetFontFamily().run();
    }
  };

  return {
    isVisible,
    currentFamily,
    currentLabel,
    items,
    handleSelect,
  };
}
