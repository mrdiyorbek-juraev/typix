"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  useTypixEditorState,
  useSignal,
} from "@typix-editor/react";
import { getFontSizeState } from "@typix-editor/extension-starter-kit";
import { ToolbarButton } from "../toolbar-button";

export function FontSizeGroup() {
  const editor = useTypixEditorState();
  const state = getFontSizeState(editor.lexical);
  const committed = useSignal(state!.currentSize);

  const [draft, setDraft] = useState(String(committed));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(String(committed));
  }, [committed, dirty]);

  const apply = () => {
    const size = parseFloat(draft);
    if (!isNaN(size) && size > 0) {
      editor.chain().focus().setFontSize({ size }).run();
    } else {
      setDraft(String(committed));
    }
    setDirty(false);
  };

  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().decreaseFontSize().run()}
        title="Decrease Font Size"
      >
        <Minus className="size-3.5" />
      </ToolbarButton>
      <input
        type="number"
        value={dirty ? draft : String(committed)}
        onChange={(e) => {
          setDraft(e.target.value);
          setDirty(true);
        }}
        onBlur={apply}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            apply();
          }
          if (e.key === "Escape") {
            setDraft(String(committed));
            setDirty(false);
          }
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-7 w-10 rounded border border-border bg-transparent px-1 text-center text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        title="Font Size"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().increaseFontSize().run()}
        title="Increase Font Size"
      >
        <Plus className="size-3.5" />
      </ToolbarButton>
    </>
  );
}
