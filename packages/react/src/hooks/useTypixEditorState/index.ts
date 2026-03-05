"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { useTypixEditor } from "../../context/editor";
import type { TypixEditor } from "@typix-editor/core";

/**
 * Returns the TypixEditor instance and re-renders whenever the editor
 * state changes (content or selection). This lets you call
 * `editor.isActive()` directly during render without any extra state.
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const editor = useTypixEditorState();
 *
 *   return (
 *     <button data-active={editor.isActive('bold')} onClick={() => editor.chain().toggleBold().run()}>
 *       Bold
 *     </button>
 *   );
 * }
 * ```
 */
export function useTypixEditorState(): TypixEditor {
  const editor = useTypixEditor();
  const [lexicalEditor] = useLexicalComposerContext();
  const [, rerender] = useState(0);

  useEffect(() => {
    return lexicalEditor.registerUpdateListener(() => {
      rerender((n) => n + 1);
    });
  }, [lexicalEditor]);

  return editor;
}
