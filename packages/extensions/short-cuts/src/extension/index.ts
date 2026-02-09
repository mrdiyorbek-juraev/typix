import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { sanitizeUrl, useTypixEditor } from "@typix-editor/react";
import {
  COMMAND_PRIORITY_NORMAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  isModifierMatch,
  KEY_DOWN_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import { useEffect, useState } from "react";
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

export type ShortCutsExtensionProps = {
  onLinkEditModeChange?: (isLinkEditMode: boolean) => void;
};

/**
 * ShortCutsExtension - Keyboard shortcuts for the editor
 *
 * Provides keyboard shortcuts for common formatting operations.
 * Uses the TypixEditor API for all operations.
 */
export function ShortCutsExtension({
  onLinkEditModeChange,
}: ShortCutsExtensionProps = {}): null {
  const editor = useTypixEditor();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  // Notify parent of link edit mode changes
  useEffect(() => {
    onLinkEditModeChange?.(isLinkEditMode);
  }, [isLinkEditMode, onLinkEditModeChange]);

  useEffect(() => {
    const lexicalEditor = editor.lexical;

    const keyboardShortcutsHandler = (event: KeyboardEvent) => {
      // Short-circuit if no modifier is pressed
      if (isModifierMatch(event, {})) {
        return false;
      }

      // Block formatting
      if (isFormatParagraph(event)) {
        editor.setParagraph();
      } else if (isFormatHeading(event)) {
        const { code } = event;
        const level = Number.parseInt(code[code.length - 1]) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6;
        if (level >= 1 && level <= 6) {
          editor.toggleHeading({ level });
        }
      } else if (isFormatBulletList(event)) {
        editor.toggleBulletList();
      } else if (isFormatNumberedList(event)) {
        editor.toggleOrderedList();
      } else if (isFormatCheckList(event)) {
        editor.toggleCheckList();
      } else if (isFormatCode(event)) {
        editor.toggleCodeBlock();
      } else if (isFormatQuote(event)) {
        editor.toggleQuote();
      }
      // Text formatting
      else if (isStrikeThrough(event)) {
        editor.toggleStrikethrough();
      } else if (isLowercase(event)) {
        lexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase");
      } else if (isUppercase(event)) {
        lexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase");
      } else if (isCapitalize(event)) {
        lexicalEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize");
      } else if (isSubscript(event)) {
        editor.toggleSubscript();
      } else if (isSuperscript(event)) {
        editor.toggleSuperscript();
      } else if (isInsertCodeBlock(event)) {
        editor.toggleCode();
      }
      // Indentation
      else if (isIndent(event)) {
        lexicalEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
      } else if (isOutdent(event)) {
        lexicalEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
      }
      // Alignment
      else if (isCenterAlign(event)) {
        lexicalEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
      } else if (isLeftAlign(event)) {
        lexicalEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
      } else if (isRightAlign(event)) {
        lexicalEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
      } else if (isJustifyAlign(event)) {
        lexicalEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
      }
      // Font size
      else if (isIncreaseFontSize(event)) {
        editor.incrementFontSize(2);
      } else if (isDecreaseFontSize(event)) {
        editor.decrementFontSize(2);
      }
      // Clear formatting
      else if (isClearFormatting(event)) {
        editor.clearFormatting();
      }
      // Link
      else if (isInsertLink(event)) {
        const url = sanitizeUrl("https://");
        setIsLinkEditMode((prev) => !prev);
        lexicalEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
      // No match
      else {
        return false;
      }

      event.preventDefault();
      return true;
    };

    return lexicalEditor.registerCommand(
      KEY_DOWN_COMMAND,
      keyboardShortcutsHandler,
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor, onLinkEditModeChange]);

  return null;
}

ShortCutsExtension.displayName = "Typix.ShortCutsExtension";
