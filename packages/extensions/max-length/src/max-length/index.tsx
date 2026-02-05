import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  type EditorState,
  type RootNode,
  RootNode as RootNodeClass,
} from "lexical";
import { useCallback, useEffect, useRef } from "react";

// ========== Types ==========

export interface MaxLengthExtensionProps {
  /**
   * Maximum character limit
   * @example 280 // Twitter-style limit
   * @example 5000 // Long-form content
   */
  maxLength: number;

  /**
   * Character counting mode
   * @default 'characters'
   */
  mode?: "characters" | "words" | "bytes";

  /**
   * Callback when limit is reached
   * @param current - Current character count
   * @param max - Maximum allowed
   * @param exceeded - Amount exceeded (if any)
   */
  onLimitReached?: (current: number, max: number, exceeded: number) => void;

  /**
   * Callback on every character change
   * @param current - Current character count
   * @param max - Maximum allowed
   * @param remaining - Characters remaining
   */
  onChange?: (current: number, max: number, remaining: number) => void;

  /**
   * Whether to show a warning before hitting the limit
   * @default 0.9 (90%)
   */
  warningThreshold?: number;

  /**
   * Callback when warning threshold is reached
   */
  onWarning?: (current: number, max: number, remaining: number) => void;

  /**
   * Strategy when limit is exceeded
   * @default 'prevent' - Prevents further input
   * @alternative 'trim' - Trims oldest content
   */
  strategy?: "prevent" | "trim";

  /**
   * Whether to count whitespace
   * @default true
   */
  countWhitespace?: boolean;

  /**
   * Custom character counter function
   * Useful for emoji, unicode, or special counting rules
   */
  customCounter?: (text: string) => number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

// ========== Utils ==========

function countCharacters(
  text: string,
  mode: "characters" | "words" | "bytes",
  countWhitespace: boolean
): number {
  if (!countWhitespace) {
    text = text.replace(/\s/g, "");
  }

  switch (mode) {
    case "words":
      return text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    case "bytes":
      return new Blob([text]).size;

    case "characters":
    default:
      // Check if Segmenter is available
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        try {
          const segmenter = new Intl.Segmenter();
          return [...segmenter.segment(text)].length;
        } catch (e) {
          // Fallback if Segmenter fails
          console.warn("Intl.Segmenter not available, using fallback");
        }
      }

      // Fallback: Use grapheme-splitter library or simple length
      return getGraphemeCount(text);
  }
}

// Fallback function for grapheme counting
function getGraphemeCount(text: string): number {
  // Simple regex-based approach (not perfect but good enough)
  // Handles most emoji and combining characters
  const graphemes = text.match(
    /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g
  );
  return graphemes ? graphemes.length : 0;
}

// ========== Component ==========

/**
 * MaxLengthExtension
 *
 * Enforces character/word limits in Lexical editor with flexible strategies
 * and callbacks for UI feedback.
 *
 * Features:
 * - Multiple counting modes (characters, words, bytes)
 * - Configurable strategies (prevent, trim, truncate)
 * - Warning thresholds
 * - Custom counter support
 * - Proper emoji/unicode handling
 * - Memory-efficient with cleanup
 *
 * @example
 * Basic usage:
 * ```tsx
 * <LexicalComposer>
 *   <MaxLengthExtension maxLength={280} />
 * </LexicalComposer>
 * ```
 *
 * @example
 * With callbacks:
 * ```tsx
 * <MaxLengthExtension
 *   maxLength={500}
 *   mode="words"
 *   onLimitReached={(current, max) => {
 *     toast.error(`Maximum ${max} words exceeded`);
 *   }}
 *   onChange={(current, max, remaining) => {
 *     setCharCount(current);
 *   }}
 * />
 * ```
 *
 * @example
 * With warning threshold:
 * ```tsx
 * <MaxLengthExtension
 *   maxLength={280}
 *   warningThreshold={0.9}
 *   onWarning={(current, max, remaining) => {
 *     toast.warning(`Only ${remaining} characters left`);
 *   }}
 * />
 * ```
 *
 * @example
 * Custom counter (e.g., for Twitter-style emoji counting):
 * ```tsx
 * <MaxLengthExtension
 *   maxLength={280}
 *   customCounter={(text) => {
 *     // Twitter counts emoji as 2 characters
 *     const emojiRegex = /\p{Emoji}/gu;
 *     const emojiCount = (text.match(emojiRegex) || []).length;
 *     return text.length + emojiCount;
 *   }}
 * />
 * ```
 */

export function MaxLengthExtension({
  maxLength,
  mode = "characters",
  onLimitReached,
  onChange,
  warningThreshold = 0.9,
  onWarning,
  strategy = "prevent",
  countWhitespace = true,
  customCounter,
  debug = false,
}: MaxLengthExtensionProps): null {
  const [editor] = useLexicalComposerContext();

  // Use refs to avoid recreating the transform on every prop change
  const lastRestoredEditorStateRef = useRef<EditorState | null>(null);
  const warningFiredRef = useRef(false);
  const propsRef = useRef({
    maxLength,
    mode,
    onLimitReached,
    onChange,
    warningThreshold,
    onWarning,
    strategy,
    countWhitespace,
    customCounter,
    debug,
  });

  // Update props ref when props change
  useEffect(() => {
    propsRef.current = {
      maxLength,
      mode,
      onLimitReached,
      onChange,
      warningThreshold,
      onWarning,
      strategy,
      countWhitespace,
      customCounter,
      debug,
    };
  }, [
    maxLength,
    mode,
    onLimitReached,
    onChange,
    warningThreshold,
    onWarning,
    strategy,
    countWhitespace,
    customCounter,
    debug,
  ]);

  const log = useCallback((...args: unknown[]) => {
    if (propsRef.current.debug) {
      console.log("[MaxLength]", ...args);
    }
  }, []);

  useEffect(() => {
    log("Registering max length extension", { maxLength, mode, strategy });

    const unregister = editor.registerNodeTransform(
      RootNodeClass,
      (rootNode: RootNode) => {
        const selection = $getSelection();

        // Only process when selection is collapsed (cursor position)
        if (!($isRangeSelection(selection) && selection.isCollapsed())) {
          return;
        }

        const props = propsRef.current;
        const prevEditorState = editor.getEditorState();
        const textContent = rootNode.getTextContent();

        // Calculate current length
        const currentLength = props.customCounter
          ? props.customCounter(textContent)
          : countCharacters(textContent, props.mode, props.countWhitespace);

        // Calculate previous length
        const prevTextContent = prevEditorState.read(() =>
          rootNode.getTextContent()
        );
        const prevLength = props.customCounter
          ? props.customCounter(prevTextContent)
          : countCharacters(prevTextContent, props.mode, props.countWhitespace);

        log("Content length", {
          current: currentLength,
          previous: prevLength,
          max: props.maxLength,
        });

        // Fire onChange callback
        if (currentLength !== prevLength && props.onChange) {
          const remaining = props.maxLength - currentLength;
          props.onChange(currentLength, props.maxLength, remaining);
        }

        // Check warning threshold
        const warningLimit = Math.floor(
          props.maxLength * props.warningThreshold
        );
        if (
          currentLength >= warningLimit &&
          currentLength < props.maxLength &&
          !warningFiredRef.current &&
          props.onWarning
        ) {
          warningFiredRef.current = true;
          const remaining = props.maxLength - currentLength;
          log("Warning threshold reached", { currentLength, warningLimit });
          props.onWarning(currentLength, props.maxLength, remaining);
        }

        // Reset warning flag when under threshold
        if (currentLength < warningLimit) {
          warningFiredRef.current = false;
        }

        // Handle limit exceeded
        if (currentLength > props.maxLength) {
          const exceeded = currentLength - props.maxLength;
          log("Limit exceeded", { exceeded, strategy: props.strategy });

          // Fire limit reached callback
          if (props.onLimitReached) {
            props.onLimitReached(currentLength, props.maxLength, exceeded);
          }

          const anchor = selection.anchor;

          switch (props.strategy) {
            case "prevent":
              if (
                prevLength === props.maxLength &&
                lastRestoredEditorStateRef.current !== prevEditorState
              ) {
                log("Restoring previous state");
                lastRestoredEditorStateRef.current = prevEditorState;
                $restoreEditorState(editor, prevEditorState);
              } else {
                log("Trimming from cursor", { amount: exceeded });
                $trimTextContentFromAnchor(editor, anchor, exceeded);
              }
              break;

            case "trim":
              // Always trim from cursor
              log("Trimming from cursor", { amount: exceeded });
              $trimTextContentFromAnchor(editor, anchor, exceeded);
              break;
          }
        }
      }
    );

    // Cleanup
    return () => {
      log("Unregistering max length extension");
      unregister();
      lastRestoredEditorStateRef.current = null;
      warningFiredRef.current = false;
    };
  }, [editor, log]);

  return null;
}

MaxLengthExtension.displayName = "Typix.MaxLengthExtension";

export default MaxLengthExtension;
