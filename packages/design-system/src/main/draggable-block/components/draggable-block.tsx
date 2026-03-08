import { useRef } from "react";
import {
  DraggableBlockPlugin,
  useRootContext,
} from "@typix-editor/react";
import { GripVertical } from "lucide-react";
import type { DraggableBlockProps } from "../types";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "typix-draggable-menu";

const DEFAULT_CLASS_NAMES = {
  menu: DRAGGABLE_BLOCK_MENU_CLASSNAME,
  targetLine: "typix-draggable__target-line",
  icon: "typix-draggable-menu__icon",
};

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

/**
 * DraggableBlock
 *
 * Enables drag and drop reordering of top-level blocks in the editor.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <DraggableBlock />
 * </EditorRoot>
 * ```
 */
export function DraggableBlock({
  classNames,
  dragHandleIcon,
}: DraggableBlockProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const { floatingAnchorElem } = useRootContext();

  const resolvedAnchorElem =
    floatingAnchorElem ??
    (typeof document !== "undefined" ? document.body : null);

  const mergedClassNames = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
  };

  if (!resolvedAnchorElem) return null;

  return (
    <DraggableBlockPlugin
      anchorElem={resolvedAnchorElem}
      isOnMenu={isOnMenu}
      menuComponent={
        <div className={mergedClassNames.menu} ref={menuRef}>
          {dragHandleIcon ?? <GripVertical className={mergedClassNames.icon} />}
        </div>
      }
      menuRef={menuRef as React.RefObject<HTMLDivElement>}
      targetLineComponent={
        <div className={mergedClassNames.targetLine} ref={targetLineRef} />
      }
      targetLineRef={targetLineRef as React.RefObject<HTMLDivElement>}
    />
  );
}

DraggableBlock.displayName = "Typix.DraggableBlock";
