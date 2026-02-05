import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import type { LexicalEditor, TextNode } from "lexical";
import {
  type JSX,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { EditorCommandProvider } from "../../context/command";
import { useEditor } from "../../hooks/useEditor";
import { cn } from "../../utils";

export type CommandMenuItemConfig = {
  icon?: JSX.Element;
  keywords?: Array<string>;
  keyboardShortcut?: string;
  shortDescription?: string;
  onSelect: (queryString: string, editor: LexicalEditor) => void;
};

export class CommandMenuOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;

  shortDescription?: string;
  // What happens when you select this option?
  onSelect: (queryString: string, editor: LexicalEditor) => void;

  constructor(title: string, options: CommandMenuItemConfig) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.shortDescription = options.shortDescription;
    this.onSelect = options.onSelect.bind(this);
  }
}

export type EditorCommandProps = {
  children: ReactNode;
  trigger?: string;
  className?: string;
  items: Array<CommandMenuOption>;
  allowWhitespace?: boolean;
  minLength?: number;
  maxLength?: number;
};

export function EditorCommand({
  children,
  items,
  trigger = "/",
  className,
  allowWhitespace = false,
  minLength = 0,
  maxLength = 50,
}: EditorCommandProps) {
  const { editor } = useEditor();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(trigger, {
    allowWhitespace,
    minLength,
    maxLength,
  });

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!queryString) return items;

    const regex = new RegExp(queryString, "i");
    return items.filter(
      (item) =>
        regex.test(item.title) ||
        item.keywords?.some((keyword) => regex.test(keyword))
    );
  }, [items, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: CommandMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString, editor);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current
          ? createPortal(
              <EditorCommandProvider
                value={{
                  editor,
                  selectedIndex: selectedIndex!,
                  setHighlightedIndex,
                  selectOptionAndCleanUp,
                  filteredItems,
                }}
              >
                <div className={cn("typix-editor-command", className)}>
                  {children}
                </div>
              </EditorCommandProvider>,
              anchorElementRef.current as HTMLElement
            )
          : null
      }
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      options={filteredItems}
      triggerFn={checkForTriggerMatch}
    />
  );
}
