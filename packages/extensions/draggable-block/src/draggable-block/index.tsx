"use client";
import { type JSX, useRef } from "react";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useRootContext } from "@typix-editor/react";

// ========== Types ==========

export interface DraggableBlockClassNames {
  /**
   * Class name for the menu container
   * @default 'draggable-block-menu'
   */
  menu?: string;

  /**
   * Class name for the target line indicator
   * @default 'draggable-block-target-line'
   */
  targetLine?: string;

  /**
   * Class name for the drag handle icon
   * @default 'draggable-block-menu-icon'
   */
  icon?: string;
}

export interface DraggableBlockExtensionProps {
  /**
   * Custom class names for component parts
   */
  classNames?: DraggableBlockClassNames;

  /**
   * Custom drag handle icon
   * If not provided, uses default grip icon
   */
  dragHandleIcon?: React.ReactNode;
}

// ========== Constants ==========

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

const DEFAULT_CLASS_NAMES: Required<DraggableBlockClassNames> = {
  menu: DRAGGABLE_BLOCK_MENU_CLASSNAME,
  targetLine: "draggable-block-target-line",
  icon: "draggable-block-menu-icon",
};

// ========== Utilities ==========

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

// ========== Default Icon ==========

function DefaultGripIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

// ========== Component ==========

/**
 * DraggableBlockExtension
 *
 * Enables drag and drop reordering of top-level blocks in the Lexical editor.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <DraggableBlockExtension />
 * ```
 *
 * @example
 * With custom classNames:
 * ```tsx
 * <DraggableBlockExtension
 *   classNames={{
 *     menu: "my-custom-menu",
 *     targetLine: "my-custom-line",
 *     icon: "my-custom-icon",
 *   }}
 * />
 * ```
 *
 * @example
 * With custom icon:
 * ```tsx
 * <DraggableBlockExtension
 *   dragHandleIcon={<MyCustomIcon />}
 * />
 * ```
 */
export function DraggableBlockExtension({
  classNames,
  dragHandleIcon,
}: DraggableBlockExtensionProps): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const { floatingAnchorElem } = useRootContext();

  const mergedClassNames = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
  };

  if (!floatingAnchorElem) {
    return null;
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={floatingAnchorElem}
      menuRef={menuRef as React.RefObject<HTMLDivElement>}
      targetLineRef={targetLineRef as React.RefObject<HTMLDivElement>}
      menuComponent={
        <div ref={menuRef} className={mergedClassNames.menu}>
          {dragHandleIcon ?? (
            <DefaultGripIcon className={mergedClassNames.icon} />
          )}
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className={mergedClassNames.targetLine} />
      }
      isOnMenu={isOnMenu}
    />
  );
}

DraggableBlockExtension.displayName = "Typix.DraggableBlockExtension";

export default DraggableBlockExtension;
