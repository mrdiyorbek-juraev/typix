"use client";

import { useEffect, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  $getSelectionStyleValueForProperty,
} from "@typix-editor/core";
import { useCurrentTypixEditor } from "./use-current-typix-editor";

/**
 * Tracks an inline CSS style property on the current Lexical selection.
 * Re-evaluates on every content or selection change.
 *
 * Returns `defaultValue` when there is no range selection or the property
 * is not set on the selected text. Throws if mounted outside a
 * TypixEditor provider.
 */
export function useSelectionStyle(property: string, defaultValue = ""): string {
  const { editor } = useCurrentTypixEditor();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!editor) return;
    const lexicalEditor = editor.lexical;
    return lexicalEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setValue(defaultValue);
          return;
        }
        const raw = $getSelectionStyleValueForProperty(
          selection,
          property,
          defaultValue,
        );
        setValue(raw || defaultValue);
      });
    });
  }, [editor, property, defaultValue]);

  if (!editor) {
    throw new Error(
      "useSelectionStyle must be used within <TypixEditorProvider> " +
        "or a <TypixEditorContext.Provider>.",
    );
  }

  return value;
}
