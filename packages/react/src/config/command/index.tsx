import { CommandMenuOption } from '@typix/react/src/core/command-menu';
import type { LexicalEditor } from 'lexical';
import type { JSX } from 'react';

export interface CommandConfig {
    title: string;
    icon?: JSX.Element;
    description?: string;
    keywords?: string[];
    shortcut?: string;
    onSelect: (queryString: string, editor: LexicalEditor) => void;
}

export function createCommand(config: CommandConfig) {
    return new CommandMenuOption(config?.title, {
        icon: config?.icon,
        keywords: config?.keywords,
        shortDescription: config?.description,
        keyboardShortcut: config?.shortcut,
        onSelect: (queryString, editor) => {
            console.log('[COMMAND EXECUTED]', config.title);
            editor.update(() => {
                config.onSelect(queryString, editor);
            });
        },
    });
}