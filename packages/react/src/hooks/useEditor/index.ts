import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, BaseSelection, type LexicalEditor } from 'lexical';
import { useState } from 'react';

/**
 * Hook to access the Lexical editor instance
 * 
 * This is a convenience hook that wraps LexicalComposerContext.
 * Use this when you only need the editor instance.
 * 
 * @returns The Lexical editor instance
 * @throws {Error} If used outside of LexicalComposer
 * 
 * @example
 * ```tsx
 * function MyPlugin() {
 *   const editor = useEditor();
 *   
 *   useEffect(() => {
 *     return editor.registerUpdateListener(({ editorState }) => {
 *       console.log('Editor updated', editorState);
 *     });
 *   }, [editor]);
 *   
 *   return null;
 * }
 * ```
 */

type UseEditorProps = {
    editor: LexicalEditor;
}
export function useEditor(): UseEditorProps {
    const [editor] = useLexicalComposerContext();
    return {
        editor,
    };
}