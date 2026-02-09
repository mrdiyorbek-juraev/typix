import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRootTextContentEmpty } from "@lexical/text";
import { useEffect, useState } from "react";

interface UseEditorStateReturn {
  /** Whether the editor content is empty */
  isEmpty: boolean;
}

/**
 * Hook for reactive editor state.
 *
 * Provides computed state that triggers re-renders when the editor content changes.
 * Use `useTypixEditor()` for editor operations (formatting, export, etc.).
 *
 * @returns Object containing reactive editor state
 *
 * @example
 * ```tsx
 * function SubmitButton() {
 *   const { isEmpty } = useEditorState();
 *
 *   return (
 *     <button disabled={isEmpty}>
 *       Submit
 *     </button>
 *   );
 * }
 * ```
 */
export function useEditorState(): UseEditorStateReturn {
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

  return { isEmpty };
}
