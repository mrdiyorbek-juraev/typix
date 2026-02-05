import { describe, expect, it, vi } from "vitest";
import {
  isFormatParagraph,
  isFormatHeading,
  isFormatNumberedList,
  isFormatBulletList,
  isFormatCheckList,
  isFormatCode,
  isFormatQuote,
  isLowercase,
  isUppercase,
  isCapitalize,
  isStrikeThrough,
  isIndent,
  isOutdent,
  isCenterAlign,
  isLeftAlign,
  isRightAlign,
  isJustifyAlign,
  isSubscript,
  isSuperscript,
  isInsertCodeBlock,
  isIncreaseFontSize,
  isDecreaseFontSize,
  isClearFormatting,
  isInsertLink,
  isAddComment,
  SHORTCUTS,
} from "../lib/shortcuts";

// Helper to create mock keyboard events
const createKeyboardEvent = (
  code: string,
  options: Partial<KeyboardEvent> = {}
): KeyboardEvent => {
  return {
    code,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    ...options,
  } as KeyboardEvent;
};

describe("shortcuts", () => {
  describe("SHORTCUTS constant", () => {
    it("exports frozen shortcuts object", () => {
      expect(SHORTCUTS).toBeDefined();
      expect(Object.isFrozen(SHORTCUTS)).toBe(true);
    });

    it("contains all expected shortcut keys", () => {
      expect(SHORTCUTS.BOLD).toBeDefined();
      expect(SHORTCUTS.ITALIC).toBeDefined();
      expect(SHORTCUTS.UNDERLINE).toBeDefined();
      expect(SHORTCUTS.UNDO).toBeDefined();
      expect(SHORTCUTS.REDO).toBeDefined();
    });
  });

  describe("isFormatParagraph", () => {
    it("returns true for Ctrl+Alt+0", () => {
      const event = createKeyboardEvent("Digit0", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatParagraph(event)).toBe(true);
    });

    it("returns true for Ctrl+Alt+Numpad0", () => {
      const event = createKeyboardEvent("Numpad0", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatParagraph(event)).toBe(true);
    });

    it("returns false without modifiers", () => {
      const event = createKeyboardEvent("Digit0");
      expect(isFormatParagraph(event)).toBe(false);
    });

    it("returns false for wrong key", () => {
      const event = createKeyboardEvent("Digit1", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatParagraph(event)).toBe(false);
    });
  });

  describe("isFormatHeading", () => {
    it("returns true for Ctrl+Alt+1", () => {
      const event = createKeyboardEvent("Digit1", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatHeading(event)).toBe(true);
    });

    it("returns true for Ctrl+Alt+2", () => {
      const event = createKeyboardEvent("Digit2", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatHeading(event)).toBe(true);
    });

    it("returns true for Ctrl+Alt+3", () => {
      const event = createKeyboardEvent("Digit3", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatHeading(event)).toBe(true);
    });

    it("returns false for Ctrl+Alt+4 (not valid heading)", () => {
      const event = createKeyboardEvent("Digit4", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatHeading(event)).toBe(false);
    });

    it("returns false when code is missing", () => {
      const event = { ctrlKey: true, altKey: true } as KeyboardEvent;
      expect(isFormatHeading(event)).toBe(false);
    });
  });

  describe("isFormatNumberedList", () => {
    it("returns true for Ctrl+Shift+7", () => {
      const event = createKeyboardEvent("Digit7", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatNumberedList(event)).toBe(true);
    });

    it("returns true for Ctrl+Shift+Numpad7", () => {
      const event = createKeyboardEvent("Numpad7", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatNumberedList(event)).toBe(true);
    });

    it("returns false without shift", () => {
      const event = createKeyboardEvent("Digit7", { ctrlKey: true });
      expect(isFormatNumberedList(event)).toBe(false);
    });
  });

  describe("isFormatBulletList", () => {
    it("returns true for Ctrl+Shift+8", () => {
      const event = createKeyboardEvent("Digit8", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatBulletList(event)).toBe(true);
    });

    it("returns true for Ctrl+Shift+Numpad8", () => {
      const event = createKeyboardEvent("Numpad8", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatBulletList(event)).toBe(true);
    });
  });

  describe("isFormatCheckList", () => {
    it("returns true for Ctrl+Shift+9", () => {
      const event = createKeyboardEvent("Digit9", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatCheckList(event)).toBe(true);
    });

    it("returns true for Ctrl+Shift+Numpad9", () => {
      const event = createKeyboardEvent("Numpad9", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatCheckList(event)).toBe(true);
    });
  });

  describe("isFormatCode", () => {
    it("returns true for Ctrl+Alt+C", () => {
      const event = createKeyboardEvent("KeyC", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isFormatCode(event)).toBe(true);
    });

    it("returns false for Ctrl+C (without alt)", () => {
      const event = createKeyboardEvent("KeyC", { ctrlKey: true });
      expect(isFormatCode(event)).toBe(false);
    });
  });

  describe("isFormatQuote", () => {
    it("returns true for Ctrl+Shift+Q", () => {
      const event = createKeyboardEvent("KeyQ", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isFormatQuote(event)).toBe(true);
    });

    it("returns false without shift", () => {
      const event = createKeyboardEvent("KeyQ", { ctrlKey: true });
      expect(isFormatQuote(event)).toBe(false);
    });
  });

  describe("case transformation shortcuts", () => {
    it("isLowercase returns true for Ctrl+Shift+1", () => {
      const event = createKeyboardEvent("Digit1", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isLowercase(event)).toBe(true);
    });

    it("isUppercase returns true for Ctrl+Shift+2", () => {
      const event = createKeyboardEvent("Digit2", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isUppercase(event)).toBe(true);
    });

    it("isCapitalize returns true for Ctrl+Shift+3", () => {
      const event = createKeyboardEvent("Digit3", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isCapitalize(event)).toBe(true);
    });
  });

  describe("isStrikeThrough", () => {
    it("returns true for Ctrl+Shift+X", () => {
      const event = createKeyboardEvent("KeyX", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isStrikeThrough(event)).toBe(true);
    });
  });

  describe("indent/outdent shortcuts", () => {
    it("isIndent returns true for Ctrl+]", () => {
      const event = createKeyboardEvent("BracketRight", { ctrlKey: true });
      expect(isIndent(event)).toBe(true);
    });

    it("isOutdent returns true for Ctrl+[", () => {
      const event = createKeyboardEvent("BracketLeft", { ctrlKey: true });
      expect(isOutdent(event)).toBe(true);
    });
  });

  describe("alignment shortcuts", () => {
    it("isCenterAlign returns true for Ctrl+Shift+E", () => {
      const event = createKeyboardEvent("KeyE", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isCenterAlign(event)).toBe(true);
    });

    it("isLeftAlign returns true for Ctrl+Shift+L", () => {
      const event = createKeyboardEvent("KeyL", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isLeftAlign(event)).toBe(true);
    });

    it("isRightAlign returns true for Ctrl+Shift+R", () => {
      const event = createKeyboardEvent("KeyR", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isRightAlign(event)).toBe(true);
    });

    it("isJustifyAlign returns true for Ctrl+Shift+J", () => {
      const event = createKeyboardEvent("KeyJ", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isJustifyAlign(event)).toBe(true);
    });
  });

  describe("subscript/superscript shortcuts", () => {
    it("isSubscript returns true for Ctrl+,", () => {
      const event = createKeyboardEvent("Comma", { ctrlKey: true });
      expect(isSubscript(event)).toBe(true);
    });

    it("isSuperscript returns true for Ctrl+.", () => {
      const event = createKeyboardEvent("Period", { ctrlKey: true });
      expect(isSuperscript(event)).toBe(true);
    });
  });

  describe("font size shortcuts", () => {
    it("isIncreaseFontSize returns true for Ctrl+Shift+.", () => {
      const event = createKeyboardEvent("Period", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isIncreaseFontSize(event)).toBe(true);
    });

    it("isDecreaseFontSize returns true for Ctrl+Shift+,", () => {
      const event = createKeyboardEvent("Comma", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isDecreaseFontSize(event)).toBe(true);
    });
  });

  describe("other shortcuts", () => {
    it("isInsertCodeBlock returns true for Ctrl+Shift+C", () => {
      const event = createKeyboardEvent("KeyC", {
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isInsertCodeBlock(event)).toBe(true);
    });

    it("isClearFormatting returns true for Ctrl+\\", () => {
      const event = createKeyboardEvent("Backslash", { ctrlKey: true });
      expect(isClearFormatting(event)).toBe(true);
    });

    it("isInsertLink returns true for Ctrl+K", () => {
      const event = createKeyboardEvent("KeyK", { ctrlKey: true });
      expect(isInsertLink(event)).toBe(true);
    });

    it("isAddComment returns true for Ctrl+Alt+M", () => {
      const event = createKeyboardEvent("KeyM", {
        ctrlKey: true,
        altKey: true,
      });
      expect(isAddComment(event)).toBe(true);
    });
  });
});
