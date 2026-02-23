"use client";

import { useSyncExternalStore } from "react";
import { useTypixEditor } from "../../context/editor";
import type { BlockType } from "../../editor";

/**
 * Returns the current block type reactively, re-rendering only when the
 * cursor moves to a different block type.
 *
 * Uses `useSyncExternalStore` internally — no `useEffect` or `useState`
 * needed in your component.
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const editor = useTypixEditor();
 *   const blockType = useBlockType();
 *
 *   return (
 *     <button
 *       data-active={blockType === "h1"}
 *       onClick={() => editor.toggleHeading({ level: 1 })}
 *     >
 *       H1
 *     </button>
 *   );
 * }
 * ```
 */
export function useBlockType(): BlockType | null {
  const editor = useTypixEditor();

  return useSyncExternalStore(
    (onStoreChange) => editor.onUpdate(onStoreChange),
    () => editor.getBlockType(),
    () => null,
  );
}
