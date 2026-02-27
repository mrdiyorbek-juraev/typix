import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
} from "./focus-utils";

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
};
