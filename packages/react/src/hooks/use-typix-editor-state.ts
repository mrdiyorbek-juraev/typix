"use client";

import { useEffect, useState } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { useCurrentTypixEditor } from "./use-current-typix-editor";

/**
 * Returns the active TypixEditor and re-renders the caller on every
 * editor update (content or selection). Use this in toolbar buttons /
 * format indicators that call `editor.isActive(...)` during render and
 * need to reflect the latest state without manual subscriptions.
 *
 * Throws if mounted outside a `<TypixEditorProvider>` /
 * `<TypixEditorContext.Provider>`.
 */
export function useTypixEditorState(): TypixEditor {
  const { editor } = useCurrentTypixEditor();
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!editor) return;
    return editor.lexical.registerUpdateListener(() => {
      rerender((n) => n + 1);
    });
  }, [editor]);

  if (!editor) {
    throw new Error(
      "useTypixEditorState must be used within <TypixEditorProvider> " +
        "or a <TypixEditorContext.Provider>. Wrap your component tree " +
        "with one of these to provide the editor instance.",
    );
  }

  return editor;
}
