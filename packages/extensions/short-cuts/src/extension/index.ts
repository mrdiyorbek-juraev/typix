import { effect, namedSignals } from "@lexical/extension";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType, IS_APPLE } from "@lexical/utils";
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

export interface ShortCutsConfig {
  /** Set to true to temporarily disable all keyboard shortcuts. */
  disabled: boolean;
  /**
   * Called whenever the link-edit mode toggles (Ctrl/⌘+K shortcut).
   * Use this to open/close your floating link toolbar.
   */
  onLinkEditModeChange?: (isLinkEditMode: boolean) => void;
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
    return listType === "bullet" ? t === "bullet"
      : listType === "number" ? t === "number"
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
  "bold", "italic", "underline", "strikethrough",
  "code", "subscript", "superscript", "highlight",
  "lowercase", "uppercase",
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

export const ShortCutsExtension = defineExtension({
  name: "@typix/short-cuts",

  config: safeCast<ShortCutsConfig>({ disabled: false }),

  build(_editor, config) {
    return namedSignals(config);
  },

  register(editor, _config, state) {
    const { disabled, onLinkEditModeChange } = state.getOutput();

    // Declared outside the effect so it survives enable/disable cycles.
    let isLinkEditMode = false;

    return effect(() => {
      if (disabled.value) return;

      const keyboardShortcutsHandler = (event: KeyboardEvent): boolean => {
        // Short-circuit if no modifier is pressed
        if (isModifierMatch(event, NO_MODIFIER)) {
          return false;
        }

        // Block formatting
        if (isFormatParagraph(event)) {
          setParagraph(editor);
        } else if (isFormatHeading(event)) {
          const { code } = event;
          const level = Number.parseInt(code[code.length - 1]) as HeadingLevel;
          if (level >= 1 && level <= 6) {
            toggleHeading(editor, level);
          }
        } else if (isFormatBulletList(event)) {
          toggleBulletList(editor);
        } else if (isFormatNumberedList(event)) {
          toggleOrderedList(editor);
        } else if (isFormatCheckList(event)) {
          toggleCheckList(editor);
        } else if (isFormatCode(event)) {
          toggleCodeBlock(editor);
        } else if (isFormatQuote(event)) {
          toggleQuote(editor);
        }
        // Text formatting
        else if (isStrikeThrough(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        } else if (isLowercase(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase");
        } else if (isUppercase(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase");
        } else if (isCapitalize(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize");
        } else if (isSubscript(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        } else if (isSuperscript(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        } else if (isInsertCodeBlock(event)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }
        // Indentation
        else if (isIndent(event)) {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        } else if (isOutdent(event)) {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }
        // Alignment
        else if (isCenterAlign(event)) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        } else if (isLeftAlign(event)) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        } else if (isRightAlign(event)) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        } else if (isJustifyAlign(event)) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }
        // Font size
        else if (isIncreaseFontSize(event)) {
          incrementFontSize(editor, 2);
        } else if (isDecreaseFontSize(event)) {
          decrementFontSize(editor, 2);
        }
        // Clear formatting
        else if (isClearFormatting(event)) {
          clearFormatting(editor);
        }
        // Link — read onLinkEditModeChange.value in the handler (not effect body)
        // so callback changes don't trigger re-registration.
        else if (isInsertLink(event)) {
          isLinkEditMode = !isLinkEditMode;
          onLinkEditModeChange?.value?.(isLinkEditMode);
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
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
