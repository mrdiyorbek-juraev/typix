import { describe, expect, it } from "vitest";

// Re-implementing the utility functions for testing (they're internal to the extension)
function countCharacters(
  text: string,
  mode: "characters" | "words" | "bytes",
  countWhitespace: boolean
): number {
  let processedText = text;
  if (!countWhitespace) {
    processedText = text.replace(/\s/g, "");
  }

  switch (mode) {
    case "words":
      return processedText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    case "bytes":
      return new Blob([processedText]).size;

    case "characters":
    default:
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        try {
          const segmenter = new Intl.Segmenter();
          return [...segmenter.segment(processedText)].length;
        } catch (e) {
          // Fallback
        }
      }
      return getGraphemeCount(processedText);
  }
}

function getGraphemeCount(text: string): number {
  const graphemes = text.match(
    /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g
  );
  return graphemes ? graphemes.length : 0;
}

describe("max-length utilities", () => {
  describe("countCharacters - characters mode", () => {
    it("counts basic ASCII characters", () => {
      expect(countCharacters("hello", "characters", true)).toBe(5);
      expect(countCharacters("hello world", "characters", true)).toBe(11);
    });

    it("counts empty string as 0", () => {
      expect(countCharacters("", "characters", true)).toBe(0);
    });

    it("counts whitespace when countWhitespace is true", () => {
      expect(countCharacters("a b c", "characters", true)).toBe(5);
    });

    it("excludes whitespace when countWhitespace is false", () => {
      expect(countCharacters("a b c", "characters", false)).toBe(3);
    });

    it("handles multiple spaces", () => {
      expect(countCharacters("a  b", "characters", true)).toBe(4);
      expect(countCharacters("a  b", "characters", false)).toBe(2);
    });

    it("handles newlines", () => {
      expect(countCharacters("a\nb", "characters", true)).toBe(3);
      expect(countCharacters("a\nb", "characters", false)).toBe(2);
    });

    it("handles tabs", () => {
      expect(countCharacters("a\tb", "characters", true)).toBe(3);
      expect(countCharacters("a\tb", "characters", false)).toBe(2);
    });
  });

  describe("countCharacters - words mode", () => {
    it("counts words separated by spaces", () => {
      expect(countCharacters("hello world", "words", true)).toBe(2);
      expect(countCharacters("one two three", "words", true)).toBe(3);
    });

    it("counts single word", () => {
      expect(countCharacters("hello", "words", true)).toBe(1);
    });

    it("handles empty string", () => {
      expect(countCharacters("", "words", true)).toBe(0);
    });

    it("handles multiple spaces between words", () => {
      expect(countCharacters("hello    world", "words", true)).toBe(2);
    });

    it("handles leading/trailing spaces", () => {
      expect(countCharacters("  hello world  ", "words", true)).toBe(2);
    });

    it("handles newlines as word separators", () => {
      expect(countCharacters("hello\nworld", "words", true)).toBe(2);
    });

    it("handles tabs as word separators", () => {
      expect(countCharacters("hello\tworld", "words", true)).toBe(2);
    });

    it("handles mixed whitespace", () => {
      expect(countCharacters("hello \n\t world", "words", true)).toBe(2);
    });
  });

  describe("countCharacters - bytes mode", () => {
    it("counts ASCII characters as 1 byte each", () => {
      expect(countCharacters("hello", "bytes", true)).toBe(5);
    });

    it("counts empty string as 0 bytes", () => {
      expect(countCharacters("", "bytes", true)).toBe(0);
    });

    it("counts spaces as 1 byte", () => {
      expect(countCharacters("a b", "bytes", true)).toBe(3);
    });

    it("excludes whitespace from byte count when countWhitespace is false", () => {
      expect(countCharacters("a b c", "bytes", false)).toBe(3);
    });

    it("counts multi-byte UTF-8 characters correctly", () => {
      // é is 2 bytes in UTF-8
      expect(countCharacters("é", "bytes", true)).toBe(2);
      // 中 is 3 bytes in UTF-8
      expect(countCharacters("中", "bytes", true)).toBe(3);
    });

    it("counts emoji correctly (4 bytes for most emoji)", () => {
      // Basic emoji are typically 4 bytes
      expect(countCharacters("😀", "bytes", true)).toBe(4);
    });
  });

  describe("getGraphemeCount", () => {
    it("counts ASCII characters", () => {
      expect(getGraphemeCount("hello")).toBe(5);
    });

    it("counts empty string as 0", () => {
      expect(getGraphemeCount("")).toBe(0);
    });

    it("counts emoji as graphemes", () => {
      // Simple emoji should count as 1 grapheme
      expect(getGraphemeCount("😀")).toBe(1);
    });

    it("counts basic unicode characters", () => {
      expect(getGraphemeCount("café")).toBe(4);
    });

    it("handles mixed ASCII and unicode", () => {
      expect(getGraphemeCount("hello 世界")).toBe(8);
    });
  });

  describe("edge cases", () => {
    it("handles only whitespace", () => {
      expect(countCharacters("   ", "characters", true)).toBe(3);
      expect(countCharacters("   ", "characters", false)).toBe(0);
      expect(countCharacters("   ", "words", true)).toBe(0);
    });

    it("handles single character", () => {
      expect(countCharacters("a", "characters", true)).toBe(1);
      expect(countCharacters("a", "words", true)).toBe(1);
      expect(countCharacters("a", "bytes", true)).toBe(1);
    });

    it("handles unicode text", () => {
      const text = "日本語テスト";
      expect(countCharacters(text, "words", true)).toBe(1); // Treated as one "word"
    });
  });
});
