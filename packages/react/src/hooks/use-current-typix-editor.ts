"use client";

import { useContext } from "react";
import type { TypixEditor } from "@typix-editor/core";
import { TypixEditorContext } from "../editor-context";

/**
 * Read the current TypixEditor from React context.
 *
 * Returns `{ editor: null }` if no `<TypixEditorContext.Provider>` or
 * `<TypixEditorProvider>` is mounted upstream — callers should null-check
 * before using `editor`.
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const { editor } = useCurrentTypixEditor()
 *   if (!editor) return null
 *   return <button onClick={() => editor.chain().toggleBold().run()}>B</button>
 * }
 * ```
 */
export function useCurrentTypixEditor(): { editor: TypixEditor | null } {
  const ctx = useContext(TypixEditorContext);
  return ctx ?? { editor: null };
}
