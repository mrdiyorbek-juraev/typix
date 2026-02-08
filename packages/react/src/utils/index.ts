import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
} from "./focus-utils";
import { addSwipeRightListener } from "./swipe";
import { sanitizeUrl, validateUrl } from "./url";
import { getSelectedNode } from './selected-node';
import { setFloatingElemPositionForLinkEditor } from './floating-element-position-for-link';
import { setFloatingElemPosition } from './floating-element-position';

/**
 * Utility function to merge Tailwind classes safely
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * @example
 * ```ts
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-2")
 * // Result: "py-2 px-2 bg-blue-500"
 * ```
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export {
  cn,
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
  addSwipeRightListener,
  validateUrl,
  sanitizeUrl,
  getSelectedNode,
  setFloatingElemPositionForLinkEditor,
  setFloatingElemPosition
};
