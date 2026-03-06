import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { $createCodeNode, $isCodeNode } from "@typix-editor/core/lexical/code";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@typix-editor/core/lexical/list";
import { TOGGLE_LINK_COMMAND } from "@typix-editor/core/lexical/link";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
} from "@typix-editor/core/lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@typix-editor/core/lexical/selection";
import { $getNearestNodeOfType, IS_APPLE } from "@typix-editor/core/lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_NORMAL,
  defineExtension,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  isModifierMatch,
  KEY_DOWN_COMMAND,
  type LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
  safeCast,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import {
  isCapitalize,
  isCenterAlign,
  isClearFormatting,
  isDecreaseFontSize,
  isFormatBulletList,
  isFormatCheckList,
  isFormatCode,
  isFormatHeading,
  isFormatNumberedList,
  isFormatParagraph,
  isFormatQuote,
  isIncreaseFontSize,
  isIndent,
  isInsertCodeBlock,
  isInsertLink,
  isJustifyAlign,
  isLeftAlign,
  isLowercase,
  isOutdent,
  isRightAlign,
  isStrikeThrough,
  isSubscript,
  isSuperscript,
  isUppercase,
} from "../lib/shortcuts";

// ─── Types ──────────────────────────────────────────────────────────────────

/**
 * Names of all built-in keyboard shortcuts.
 * Set any name to `false` in `overrides` to disable that shortcut.
 */
export type ShortcutName =
  | "formatParagraph"
  | "formatHeading"
  | "formatBulletList"
  | "formatNumberedList"
  | "formatCheckList"
  | "formatCode"
  | "formatQuote"
  | "strikethrough"
  | "lowercase"
  | "uppercase"
  | "capitalize"
  | "subscript"
  | "superscript"
  | "insertCodeBlock"
  | "indent"
  | "outdent"
  | "centerAlign"
  | "leftAlign"
  | "rightAlign"
  | "justifyAlign"
  | "increaseFontSize"
  | "decreaseFontSize"
  | "clearFormatting"
  | "insertLink";

export interface ShortCutsConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable all keyboard shortcuts. */
  disabled: boolean;
  /**
   * Called whenever the link-edit mode toggles (Ctrl/⌘+K shortcut).
   * Use this to open/close your floating link toolbar.
   */
  onLinkEditModeChange?: (isLinkEditMode: boolean) => void;
  /**
   * Selectively disable individual built-in shortcuts.
   * Set a shortcut name to `false` to prevent it from firing.
   *
   * @example
   * // Disable the link shortcut and the quote shortcut
   * overrides: { insertLink: false, formatQuote: false }
   */
  overrides?: Partial<Record<ShortcutName, false>>;
}

// ─── Inlined pure helpers ────────────────────────────────────────────────────
// These replicate the commands from @typix-editor/react without any React dep.

const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!SUPPORTED_URL_PROTOCOLS.has(parsed.protocol)) return "about:blank";
  } catch {
    return url;
  }
  return url;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

function isListActive(
  editor: LexicalEditor,
  listType: "bullet" | "number" | "check"
): boolean {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return false;
    const element = selection.anchor.getNode().getTopLevelElementOrThrow();
    const listNode = $getNearestNodeOfType(element, ListNode);
    if (!(listNode && $isListNode(listNode))) return false;
    const t = listNode.getListType();
    return listType === "bullet"
      ? t === "bullet"
      : listType === "number"
        ? t === "number"
        : t === "check";
  });
}

function setParagraph(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
}

function toggleHeading(editor: LexicalEditor, level: HeadingLevel): void {
  const tag = `h${level}` as const;
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    const element = selection.anchor.getNode().getTopLevelElementOrThrow();
    const currentTag =
      element.getType() === "heading"
        ? (element as unknown as { getTag(): string }).getTag()
        : null;
    $setBlocksType(selection, () =>
      currentTag === tag ? $createParagraphNode() : $createHeadingNode(tag)
    );
  });
}

function toggleBulletList(editor: LexicalEditor): void {
  if (isListActive(editor, "bullet")) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }
}

function toggleOrderedList(editor: LexicalEditor): void {
  if (isListActive(editor, "number")) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }
}

function toggleCheckList(editor: LexicalEditor): void {
  if (isListActive(editor, "check")) {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  }
}

function toggleCodeBlock(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    const element = selection.anchor.getNode().getTopLevelElementOrThrow();
    $setBlocksType(selection, () =>
      $isCodeNode(element) ? $createParagraphNode() : $createCodeNode()
    );
  });
}

function toggleQuote(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    const element = selection.anchor.getNode().getTopLevelElementOrThrow();
    $setBlocksType(selection, () =>
      $isQuoteNode(element) ? $createParagraphNode() : $createQuoteNode()
    );
  });
}

const TEXT_FORMAT_TYPES = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "subscript",
  "superscript",
  "highlight",
  "lowercase",
  "uppercase",
] as const;

function clearFormatting(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const { anchor, focus } = selection;
    if (anchor.key === focus.key && anchor.offset === focus.offset) return;

    for (const node of selection.getNodes()) {
      if ($isTextNode(node)) {
        let n = node;
        for (const fmt of TEXT_FORMAT_TYPES) {
          if (n.hasFormat(fmt)) n = n.toggleFormat(fmt);
        }
        if (n.getStyle() !== "") n.setStyle("");
      }
    }
  });
}

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 144;
const DEFAULT_FONT_SIZE = 16;

function getFontSize(editor: LexicalEditor): number {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return DEFAULT_FONT_SIZE;
    const anchor = selection.anchor.getNode();
    if (!$isTextNode(anchor)) return DEFAULT_FONT_SIZE;
    const m = (anchor.getStyle() ?? "").match(/font-size:\s*(\d+)px/);
    return m?.[1] ? Number.parseInt(m[1], 10) : DEFAULT_FONT_SIZE;
  });
}

function setFontSize(editor: LexicalEditor, size: number): void {
  const clamped = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $patchStyleText(selection, { "font-size": `${clamped}px` });
    }
  });
}

function incrementFontSize(editor: LexicalEditor, step = 1): void {
  setFontSize(editor, getFontSize(editor) + step);
}

function decrementFontSize(editor: LexicalEditor, step = 1): void {
  setFontSize(editor, getFontSize(editor) - step);
}

// ─── Extension ──────────────────────────────────────────────────────────────

/** @internal Used in the shortcut handler to detect any modifier key. */
const NO_MODIFIER = IS_APPLE
  ? { metaKey: false, altKey: false, ctrlKey: false, shiftKey: false }
  : { ctrlKey: false, altKey: false, metaKey: false, shiftKey: false };

export const ShortCutsExtension = (
  userConfig: Partial<ShortCutsConfig> = {}
) => {
  const resolvedConfig: ShortCutsConfig = {
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/short-cuts",

    config: safeCast<ShortCutsConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled, onLinkEditModeChange } = state.getOutput();

      // Declared outside the effect so it survives enable/disable cycles.
      let isLinkEditMode = false;

      return effect(() => {
        if (disabled.value) return;

        const { overrides } = resolvedConfig;

        const keyboardShortcutsHandler = (event: KeyboardEvent): boolean => {
          // Short-circuit if no modifier is pressed
          if (isModifierMatch(event, NO_MODIFIER)) {
            return false;
          }

          // Block formatting
          if (isFormatParagraph(event)) {
            if (overrides?.formatParagraph === false) return false;
            setParagraph(editor);
          } else if (isFormatHeading(event)) {
            if (overrides?.formatHeading === false) return false;
            const { code } = event;
            const level = Number.parseInt(
              code[code.length - 1]
            ) as HeadingLevel;
            if (level >= 1 && level <= 6) {
              toggleHeading(editor, level);
            }
          } else if (isFormatBulletList(event)) {
            if (overrides?.formatBulletList === false) return false;
            toggleBulletList(editor);
          } else if (isFormatNumberedList(event)) {
            if (overrides?.formatNumberedList === false) return false;
            toggleOrderedList(editor);
          } else if (isFormatCheckList(event)) {
            if (overrides?.formatCheckList === false) return false;
            toggleCheckList(editor);
          } else if (isFormatCode(event)) {
            if (overrides?.formatCode === false) return false;
            toggleCodeBlock(editor);
          } else if (isFormatQuote(event)) {
            if (overrides?.formatQuote === false) return false;
            toggleQuote(editor);
          }
          // Text formatting
          else if (isStrikeThrough(event)) {
            if (overrides?.strikethrough === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          } else if (isLowercase(event)) {
            if (overrides?.lowercase === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase");
          } else if (isUppercase(event)) {
            if (overrides?.uppercase === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase");
          } else if (isCapitalize(event)) {
            if (overrides?.capitalize === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize");
          } else if (isSubscript(event)) {
            if (overrides?.subscript === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
          } else if (isSuperscript(event)) {
            if (overrides?.superscript === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
          } else if (isInsertCodeBlock(event)) {
            if (overrides?.insertCodeBlock === false) return false;
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          }
          // Indentation
          else if (isIndent(event)) {
            if (overrides?.indent === false) return false;
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          } else if (isOutdent(event)) {
            if (overrides?.outdent === false) return false;
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }
          // Alignment
          else if (isCenterAlign(event)) {
            if (overrides?.centerAlign === false) return false;
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          } else if (isLeftAlign(event)) {
            if (overrides?.leftAlign === false) return false;
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          } else if (isRightAlign(event)) {
            if (overrides?.rightAlign === false) return false;
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          } else if (isJustifyAlign(event)) {
            if (overrides?.justifyAlign === false) return false;
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
          }
          // Font size
          else if (isIncreaseFontSize(event)) {
            if (overrides?.increaseFontSize === false) return false;
            incrementFontSize(editor, 2);
          } else if (isDecreaseFontSize(event)) {
            if (overrides?.decreaseFontSize === false) return false;
            decrementFontSize(editor, 2);
          }
          // Clear formatting
          else if (isClearFormatting(event)) {
            if (overrides?.clearFormatting === false) return false;
            clearFormatting(editor);
          }
          // Link — read onLinkEditModeChange.value in the handler (not effect body)
          // so callback changes don't trigger re-registration.
          else if (isInsertLink(event)) {
            if (overrides?.insertLink === false) return false;
            isLinkEditMode = !isLinkEditMode;
            onLinkEditModeChange?.value?.(isLinkEditMode);
            editor.dispatchCommand(
              TOGGLE_LINK_COMMAND,
              sanitizeUrl("https://")
            );
          }
          // No match
          else {
            return false;
          }

          event.preventDefault();
          return true;
        };

        return editor.registerCommand(
          KEY_DOWN_COMMAND,
          keyboardShortcutsHandler,
          COMMAND_PRIORITY_NORMAL
        );
      });
    },
  });

  return defineTypixExtension({
    name: "short-cuts",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
