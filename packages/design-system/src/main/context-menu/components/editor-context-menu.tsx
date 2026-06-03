import { useTypixEditorState } from "@typix-editor/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../../../primitives/context-menu";
import { cn } from "../../../lib/utils";
import type { EditorContextMenuProps, EditorContextMenuItem } from "../types";
import type { TypixEditor as TypixEditorType } from "@typix-editor/core";

function resolveFlag(
  flag: boolean | ((editor: TypixEditorType) => boolean) | undefined,
  editor: TypixEditorType
): boolean {
  if (typeof flag === "function") return flag(editor);
  return flag ?? false;
}

/**
 * Editor context menu — wraps editor content in a shadcn ContextMenu.
 * Right-click anywhere inside the wrapped area to open the menu.
 *
 * @example
 * ```tsx
 * <EditorContextMenu items={menuItems}>
 *   <EditorContent className="min-h-[400px] p-4" />
 * </EditorContextMenu>
 * ```
 */
export function EditorContextMenu({
  items,
  className,
  children,
}: EditorContextMenuProps) {
  const editor = useTypixEditorState();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className={cn("w-56", className)}>
        {items.map((item, i) => {
          if (resolveFlag(item.hidden, editor)) return null;

          if (item.type === "separator") {
            return <ContextMenuSeparator key={i} />;
          }

          if (item.type === "label") {
            return <ContextMenuLabel key={i}>{item.label}</ContextMenuLabel>;
          }

          const disabled = resolveFlag(item.disabled, editor);

          return (
            <ContextMenuItem
              key={i}
              disabled={disabled}
              onSelect={() => item.onSelect(editor)}
            >
              {item.icon && (
                <span className="size-4 shrink-0 [&_svg]:size-4">
                  {item.icon}
                </span>
              )}
              {item.label}
              {item.shortcut && (
                <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
              )}
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}

EditorContextMenu.displayName = "Typix.EditorContextMenu";
