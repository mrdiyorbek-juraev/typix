"use client";

import { useTypixEditorState, useSignal } from "@typix-editor/react";
import { getFontFamilyState } from "@typix-editor/extension-starter-kit";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Monospace", value: "monospace" },
] as const;

export function FontFamilyGroup() {
  const editor = useTypixEditorState();
  const state = getFontFamilyState(editor.lexical);
  const family = useSignal(state!.currentFamily);

  return (
    <select
      value={family}
      onChange={(e) => {
        const val = e.target.value;
        if (val) {
          editor.chain().focus().setFontFamily({ family: val }).run();
        } else {
          editor.chain().focus().resetFontFamily().run();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="h-7 rounded border border-border bg-transparent px-1 text-xs"
      title="Font Family"
    >
      {FONT_FAMILIES.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
