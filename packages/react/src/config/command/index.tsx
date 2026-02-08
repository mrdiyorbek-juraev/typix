import type { LexicalEditor } from "lexical";
import type { JSX } from "react";
import { CommandMenuOption } from "../../core/command-menu";

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
      editor.update(() => {
        config.onSelect(queryString, editor);
      });
    },
  });
}
