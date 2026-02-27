"use client";

import { $getSelection, $isRangeSelection, type TextFormatType } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { TEXT_FORMAT_TYPES } from "@typix-editor/core";
import { useTypixEditor } from "../../context/editor";

/**
 * Options for useActiveFormats hook
 */
interface UseActiveFormatsOptions {
  /**
   * Specific formats to track. If not provided, tracks all formats.
   * Use this to optimize performance by only tracking formats you need.
   *
   * @example
   * ```tsx
   * // Only track bold and italic
   * const { isActive } = useActiveFormats({ formats: ['bold', 'italic'] });
   * ```
   */
  formats?: TextFormatType[];
}

/**
 * Return type for useActiveFormats hook
 */
interface UseActiveFormatsReturn {
  /**
   * Set of currently active format types.
   *
   * @example
   * ```tsx
   * if (activeFormats.has('bold')) {
   *   // Bold is active
   * }
   * ```
   */
  activeFormats: Set<TextFormatType>;

  /**
   * Check if a specific format is active.
   * This is a convenience function that checks the activeFormats set.
   *
   * @param format - The format type to check
   * @returns true if the format is active
   *
   * @example
   * ```tsx
   * <button className={isActive('bold') ? 'active' : ''}>
   *   Bold
   * </button>
   * ```
   */
  isActive: (format: TextFormatType) => boolean;
}

/**
 * Hook that provides reactive format state.
 *
 * Unlike `editor.isActive()` which reads synchronously,
 * this hook causes re-renders when the active formats change.
 * Use this for toolbar buttons that need to reflect current format state.
 *
 * @param options - Optional configuration
 * @returns Object with activeFormats set and isActive helper
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const editor = useTypixEditor();
 *   const { isActive } = useActiveFormats();
 *
 *   return (
 *     <div>
 *       <button
 *         className={isActive('bold') ? 'active' : ''}
 *         onClick={() => editor.toggleBold()}
 *       >
 *         Bold
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useActiveFormats(
  options: UseActiveFormatsOptions = {}
): UseActiveFormatsReturn {
  const editor = useTypixEditor();
  const { formats = TEXT_FORMAT_TYPES } = options;

  // Stabilize formats reference to avoid re-subscribing on every render
  const formatsRef = useRef(formats);
  if (
    formats.length !== formatsRef.current.length ||
    formats.some((f, i) => f !== formatsRef.current[i])
  ) {
    formatsRef.current = formats;
  }
  const stableFormats = formatsRef.current;

  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(
    () => new Set()
  );

  useEffect(() => {
    // Read initial state
    const initialFormats = editor.read(() => {
      const selection = $getSelection();
      const active = new Set<TextFormatType>();

      if ($isRangeSelection(selection)) {
        for (const format of stableFormats) {
          if (selection.hasFormat(format)) {
            active.add(format);
          }
        }
      }

      return active;
    });

    setActiveFormats(initialFormats);

    // Subscribe to updates
    return editor.onUpdate(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        const active = new Set<TextFormatType>();

        if ($isRangeSelection(selection)) {
          for (const format of stableFormats) {
            if (selection.hasFormat(format)) {
              active.add(format);
            }
          }
        }

        // Only update if formats actually changed
        setActiveFormats((prev) => {
          if (prev.size !== active.size) return active;

          for (const format of active) {
            if (!prev.has(format)) return active;
          }

          return prev;
        });
      });
    });
  }, [editor, stableFormats]);

  const isActive = useCallback(
    (format: TextFormatType): boolean => activeFormats.has(format),
    [activeFormats]
  );

  return {
    activeFormats,
    isActive,
  };
}
