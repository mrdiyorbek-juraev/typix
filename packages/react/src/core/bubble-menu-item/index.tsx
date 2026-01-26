import { forwardRef, useEffect, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEditor } from "../../hooks/useEditor";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, TextFormatType, type LexicalEditor } from "lexical";
import { Slot } from '@radix-ui/react-slot';
import { cn } from "../../utils";

export interface EditorBubbleItemRenderProps {
    isActive: boolean;
    name: TextFormatType;
}

export interface EditorBubbleItemProps {
    readonly children: ReactNode | ((props: EditorBubbleItemRenderProps) => ReactNode);
    readonly onSelect?: (editor: LexicalEditor) => void;
    readonly name: TextFormatType;
    readonly className?: string;
}

export const EditorBubbleItem = forwardRef<
    HTMLDivElement,
    EditorBubbleItemProps & Omit<ComponentPropsWithoutRef<"div">, "onSelect" | "children">
>(({ children, name, onSelect, className, ...rest }, ref) => {
    const { editor } = useEditor();
    const [isActive, setIsActive] = useState<boolean>(false);


    useEffect(() => {
        if (!editor) return;

        const updateActive = () => {
            const active = editor.getEditorState().read(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return false;
                return selection.hasFormat(name);
            });
            setIsActive(active);
        };

        const remove = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateActive();
                return false;
            },
            0
        );

        updateActive();
        return () => remove();
    }, [editor, name]);


    if (!editor) return null;

    const content = typeof children === 'function'
        ? children({ isActive, name })
        : children;

    // Only use Slot if asChild AND children is not a function
    const Comp = typeof children !== 'function' ? Slot : "div";

    return (
        <Comp
            ref={ref}
            onClick={() => {
                onSelect?.(editor);
            }}
            className={cn("typix-editor-bubble-item", className)}
            {...rest}
        >
            {content}
        </Comp>
    );
});

EditorBubbleItem.displayName = "Typix.EditorBubbleItem";

export default EditorBubbleItem;