import { createContext, useContext } from 'react';
import type { LexicalEditor } from 'lexical';
import { CommandMenuOption } from '../../core/command-menu';

interface EditorCommandContextValue {
    editor: LexicalEditor;
    selectedIndex: number;
    setHighlightedIndex: (index: number) => void;
    selectOptionAndCleanUp: (option: CommandMenuOption) => void;
    filteredItems: Array<CommandMenuOption>;
}

const EditorCommandContext = createContext<EditorCommandContextValue | null>(null);

export const useEditorCommand = () => {
    const context = useContext(EditorCommandContext);
    if (!context) throw new Error('useEditorCommand must be used within EditorCommand');
    return context;
};

export const EditorCommandProvider = EditorCommandContext.Provider;