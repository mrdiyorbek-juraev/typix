import type { LexicalEditor } from "lexical";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
} from "react";
import { useEditorCommand } from "../../context/command";
import { useEditor } from "../../hooks/useEditor";
import { cn } from "../../utils";

export interface EditorCommandItemRenderProps {
  isSelected: boolean;
  value: string;
}

export interface EditorCommandItemBaseProps {
  readonly children:
    | ReactNode
    | ((props: EditorCommandItemRenderProps) => ReactNode);
  readonly value: string;
  readonly className?: string;
  readonly keywords?: string[];
  readonly as?: ElementType;
  readonly onSelect?: (value: string, editor: LexicalEditor) => void;
}

type EditorCommandItemProps<T extends ElementType = "li"> =
  EditorCommandItemBaseProps &
    Omit<
      ComponentPropsWithoutRef<T>,
      keyof EditorCommandItemBaseProps | "children"
    >;

const EditorCommandItemInner = forwardRef<HTMLElement, EditorCommandItemProps>(
  (
    { children, value, className, keywords, as = "li", onSelect, ...rest },
    ref
  ) => {
    const {
      selectedIndex,
      setHighlightedIndex,
      selectOptionAndCleanUp,
      filteredItems,
    } = useEditorCommand();

    const Comp = as;
    const { editor } = useEditor();

    // Find this item's index in filtered items
    const index = filteredItems.findIndex((item) => item.title === value);
    const isSelected = selectedIndex === index;

    if (index === -1) return null;

    const content =
      typeof children === "function"
        ? children({
            isSelected,
            value,
          })
        : children;

    return (
      <Comp
        aria-selected={isSelected}
        className={cn(
          "typix-editor-command-item",
          isSelected && "typix-editor-command-item-selected",
          className
        )}
        onClick={() => {
          onSelect?.(value, editor);
          const item = filteredItems[index];
          selectOptionAndCleanUp(item!);
        }}
        onMouseEnter={() => setHighlightedIndex(index)}
        ref={ref}
        role="option"
        tabIndex={-1}
        {...rest}
      >
        {content}
      </Comp>
    );
  }
);

EditorCommandItemInner.displayName = "Typix.EditorCommandItem";

export const EditorCommandItem = EditorCommandItemInner as <
  T extends ElementType = "li",
>(
  props: EditorCommandItemProps<T> & { ref?: React.Ref<HTMLElement> }
) => React.ReactElement | null;

export default EditorCommandItem;
