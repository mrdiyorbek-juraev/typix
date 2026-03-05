"use client";

import { useEffect } from "react";
import { KEY_DOWN_COMMAND, COMMAND_PRIORITY_NORMAL } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { ShortcutDefinition } from "@typix-editor/core";
import { useTypixEditor } from "../../context/editor";

/**
 * Maps a shortcut key string to a KeyboardEvent.code value.
 * Using event.code (physical key) instead of event.key (character) ensures
 * shortcuts work on Mac where Alt/Option changes the produced character
 * (e.g. Alt+1 produces '¡' on Mac but event.code is always 'Digit1').
 */
function keyToCode(key: string): string {
  if (key.length === 1) {
    if (/[a-zA-Z]/.test(key)) return `Key${key.toUpperCase()}`;
    if (/[0-9]/.test(key)) return `Digit${key}`;
  }
  const special: Record<string, string> = {
    "`": "Backquote",
    "-": "Minus",
    "=": "Equal",
    "[": "BracketLeft",
    "]": "BracketRight",
    "\\": "Backslash",
    ";": "Semicolon",
    "'": "Quote",
    ",": "Comma",
    ".": "Period",
    "/": "Slash",
  };
  return special[key] ?? key;
}

function matchesShortcut(
  event: KeyboardEvent,
  shortcut: ShortcutDefinition
): boolean {
  const needsMod = shortcut.modifiers.includes("mod");
  const needsShift = shortcut.modifiers.includes("shift");
  const needsAlt = shortcut.modifiers.includes("alt");

  const hasMod = event.ctrlKey || event.metaKey;

  return (
    hasMod === needsMod &&
    event.shiftKey === needsShift &&
    event.altKey === needsAlt &&
    event.code === keyToCode(shortcut.key)
  );
}

/**
 * Registers all keyboard shortcuts from the extension registry with
 * the Lexical editor. Add this inside EditorRoot.
 */
export function ShortcutsPlugin() {
  const [lexicalEditor] = useLexicalComposerContext();
  const typixEditor = useTypixEditor();

  useEffect(() => {
    const shortcuts = typixEditor.getShortcuts();

    return lexicalEditor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        for (const shortcut of shortcuts) {
          if (matchesShortcut(event, shortcut)) {
            event.preventDefault();
            typixEditor.run(shortcut.command, shortcut.args);
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [lexicalEditor, typixEditor]);

  return null;
}
