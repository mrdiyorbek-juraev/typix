"use client";

import { useEffect, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  $getSelectionStyleValueForProperty,
} from "@typix-editor/core";
import { useTypixEditor } from "../editor-context";

/**
 * Tracks an inline CSS style property on the current Lexical selection.
 * Re-evaluates on every content or selection change.
 *
 * Returns `defaultValue` when there is no range selection or the property
 * is not set on the selected text.
 */
export function useSelectionStyle(property: string, defaultValue = ""): string {
  const editor = useTypixEditor();
  const lexicalEditor = editor.lexical;
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
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
          defaultValue
        );
        setValue(raw || defaultValue);
      });
    });
  }, [lexicalEditor, property, defaultValue]);

  return value;
}
