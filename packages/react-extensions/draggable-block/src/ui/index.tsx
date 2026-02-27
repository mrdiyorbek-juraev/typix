"use client";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { type JSX, useRef } from "react";
import type { DraggableBlockClassNames } from "@typix-editor/extension-draggable-block";
import { useRootContext } from "@typix-editor/react";

// ========== UI Props ==========

export type DraggableBlockUIProps = {
  /**
   * Custom class names for component parts
   */
  classNames?: DraggableBlockClassNames;

  /**
   * Custom drag handle icon
   * If not provided, uses default grip icon
   */
  dragHandleIcon?: React.ReactNode;
};

/** @deprecated Use DraggableBlockUIProps */
export type DraggableBlockExtensionProps = DraggableBlockUIProps;

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
 * DraggableBlockUI
 *
 * Enables drag and drop reordering of top-level blocks in the Lexical editor.
 *
 * @example
 * Basic usage:
 * ```tsx
 * <DraggableBlockUI />
 * ```
 *
 * @example
 * With a custom anchor element (e.g. from Typix's useRootContext):
 * ```tsx
 * const { floatingAnchorElem } = useRootContext();
 * <DraggableBlockUI anchorElem={floatingAnchorElem ?? undefined} />
 * ```
 */
export function DraggableBlockUI({
  classNames,
  dragHandleIcon,
}: DraggableBlockUIProps): JSX.Element | null {
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

  if (!resolvedAnchorElem) {
    return null;
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={resolvedAnchorElem}
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

DraggableBlockUI.displayName = "Typix.DraggableBlockUI";
