import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRootTextContentEmpty } from "@lexical/text";
import type { LexicalEditor } from "lexical";
import { useEffect, useState } from "react";

/**
 * Hook to access the Lexical editor instance and state
 *
 * Provides the editor instance along with computed state like `isEmpty`.
 *
 * @returns Object containing the editor instance and state
 * @throws {Error} If used outside of LexicalComposer
 *
 * @example
 * ```tsx
 * function MyPlugin() {
 *   const { editor, isEmpty } = useEditor();
 *
 *   return (
 *     <button disabled={isEmpty}>
 *       Submit
 *     </button>
 *   );
 * }
 * ```
 */

type UseEditorReturn = {
  /** The Lexical editor instance */
  editor: LexicalEditor;
  /** Whether the editor content is empty */
  isEmpty: boolean;
};

export function useEditor(): UseEditorReturn {
  const [editor] = useLexicalComposerContext();

  const [isEmpty, setIsEmpty] = useState(() =>
    editor
      .getEditorState()
      .read(() => $isRootTextContentEmpty(editor.isComposing(), true))
  );

  useEffect(
    () =>
      editor.registerUpdateListener(({ editorState }) => {
        const currentlyEmpty = editorState.read(() =>
          $isRootTextContentEmpty(editor.isComposing(), true)
        );
        setIsEmpty(currentlyEmpty);
      }),
    [editor]
  );

  return {
    editor,
    isEmpty,
  };
}
