import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { cn } from "../../utils";
import { useEditorCommand } from "../../context/command";
import { type LexicalEditor } from "lexical";
import { useEditor } from "../../hooks/useEditor";

export interface EditorCommandItemRenderProps {
    isSelected: boolean;
    value: string;
}

export interface EditorCommandItemBaseProps {
    readonly children: ReactNode | ((props: EditorCommandItemRenderProps) => ReactNode);
    readonly value: string;
    readonly className?: string;
    readonly keywords?: string[];
    readonly as?: ElementType;
    readonly onSelect?: (value: string, editor: LexicalEditor) => void;
}

type EditorCommandItemProps<T extends ElementType = "li"> = EditorCommandItemBaseProps &
    Omit<ComponentPropsWithoutRef<T>, keyof EditorCommandItemBaseProps | "children">;

const EditorCommandItemInner = forwardRef<HTMLElement, EditorCommandItemProps>((
    { children, value, className, keywords, as = "li", onSelect, ...rest }, ref) => {
    const {
        selectedIndex,
        setHighlightedIndex,
        selectOptionAndCleanUp,
        filteredItems
    } = useEditorCommand();

    const Comp = as;
    const { editor } = useEditor();

    // Find this item's index in filtered items
    const index = filteredItems.findIndex(item => item.title === value);
    const isSelected = selectedIndex === index;

    if (index === -1) return null;


    const content = typeof children === 'function'
        ? children({
            isSelected,
            value,

        })
        : children;

    return (
        <Comp
            ref={ref}
            role="option"
            aria-selected={isSelected}
            tabIndex={-1}
            className={cn(
                "typix-editor-command-item",
                isSelected && "typix-editor-command-item-selected",
                className
            )}
            onMouseEnter={() => setHighlightedIndex(index)}
            onClick={() => {
                onSelect?.(value, editor);
                const item = filteredItems[index];
                selectOptionAndCleanUp(item!);
            }}
            {...rest}
        >
            {content}
        </Comp>
    );
});

EditorCommandItemInner.displayName = "Typix.EditorCommandItem";

export const EditorCommandItem = EditorCommandItemInner as <T extends ElementType = "li">(
    props: EditorCommandItemProps<T> & { ref?: React.Ref<HTMLElement> }
) => React.ReactElement | null;

export default EditorCommandItem;