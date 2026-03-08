import type { LexicalEditor } from "lexical";
import type { CSSProperties, ReactNode } from "react";

export interface FloatingElementProps {
  /**
   * Control visibility externally. `undefined` = auto from selection; `true`/`false` = controlled.
   */
  shouldShow?: boolean;

  /**
   * z-index for the floating element.
   * @default 50
   */
  zIndex?: number;

  /**
   * Called when visibility changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Rect priority 1: use this element's bounding rect as the target.
   */
  referenceElement?: HTMLElement | null;

  /**
   * Rect priority 2: custom function to compute the target rect.
   */
  getBoundingClientRect?: (editor: LexicalEditor) => DOMRect | null;

  /**
   * Whether pressing Escape hides the element.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Vertical gap between target rect and floating element in pixels.
   * @default 10
   */
  verticalGap?: number;

  /**
   * Horizontal offset in pixels.
   * @default 5
   */
  horizontalOffset?: number;

  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface UseFloatingElementOptions extends FloatingElementProps {
  editor: LexicalEditor;
  anchorElem: HTMLElement | null;
}
