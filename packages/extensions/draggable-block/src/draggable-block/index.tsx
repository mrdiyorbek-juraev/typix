"use client";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useRootContext } from "@typix-editor/react";
import { type JSX, useRef } from "react";

// ========== Types ==========

export interface DraggableBlockClassNames {
  /**
   * Class name for the menu container
   * @default 'typix-draggable-menu'
   */
  menu?: string;

  /**
   * Class name for the target line indicator
   * @default 'typix-draggable__target-line'
   */
  targetLine?: string;

  /**
   * Class name for the drag handle icon
   * @default 'typix-draggable-menu__icon'
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

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "typix-draggable-menu";

const DEFAULT_CLASS_NAMES: Required<DraggableBlockClassNames> = {
  menu: DRAGGABLE_BLOCK_MENU_CLASSNAME,
  targetLine: "typix-draggable__target-line",
  icon: "typix-draggable-menu__icon",
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
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
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
      isOnMenu={isOnMenu}
      menuComponent={
        <div className={mergedClassNames.menu} ref={menuRef}>
          {dragHandleIcon ?? (
            <DefaultGripIcon className={mergedClassNames.icon} />
          )}
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

DraggableBlockExtension.displayName = "Typix.DraggableBlockExtension";
