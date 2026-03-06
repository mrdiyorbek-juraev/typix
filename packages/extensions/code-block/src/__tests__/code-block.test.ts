import { describe, expect, it } from "vitest";
import { CodeBlockExtension, getCodeBlockOutput } from "../extension";
import {
  searchLanguages,
  getLanguageDisplayName,
  normalizeLanguage,
  LANGUAGE_MAP,
  LANGUAGE_KEYS,
} from "../languages";

describe("CodeBlockExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = CodeBlockExtension();
      expect(ext.name).toBe("code-block");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = CodeBlockExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("sets defaultLanguage to javascript by default", () => {
      const ext = CodeBlockExtension();
      expect(ext.config?.defaultLanguage).toBe("javascript");
    });

    it("accepts user overrides", () => {
      const ext = CodeBlockExtension({
        disabled: true,
        defaultLanguage: "python",
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.defaultLanguage).toBe("python");
    });
  });

  describe("commands", () => {
    it("registers insertCodeBlock command", () => {
      const ext = CodeBlockExtension();
      expect(ext.commands).toHaveProperty("insertCodeBlock");
    });

    it("registers setCodeLanguage command", () => {
      const ext = CodeBlockExtension();
      expect(ext.commands).toHaveProperty("setCodeLanguage");
    });

    it("registers copyCode command", () => {
      const ext = CodeBlockExtension();
      expect(ext.commands).toHaveProperty("copyCode");
    });

    it("registers deleteCodeBlock command", () => {
      const ext = CodeBlockExtension();
      expect(ext.commands).toHaveProperty("deleteCodeBlock");
    });
  });

  describe("shortcuts", () => {
    it("registers Ctrl+Alt+` shortcut for insertCodeBlock", () => {
      const ext = CodeBlockExtension();
      expect(ext.shortcuts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "`",
            modifiers: ["mod", "alt"],
            command: "insertCodeBlock",
          }),
        ])
      );
    });
  });

  describe("getCodeBlockOutput", () => {
    it("returns undefined for an unregistered editor", () => {
      // Without a real editor, the output map won't have an entry
      const result = getCodeBlockOutput({} as any);
      expect(result).toBeUndefined();
    });
  });
});

describe("code-block languages", () => {
  describe("LANGUAGE_MAP", () => {
    it("is a non-empty object", () => {
      expect(Object.keys(LANGUAGE_MAP).length).toBeGreaterThan(0);
    });

    it("maps js to JavaScript", () => {
      expect(LANGUAGE_MAP.js).toBe("JavaScript");
    });

    it("maps typescript to TypeScript", () => {
      expect(LANGUAGE_MAP.typescript).toBe("TypeScript");
    });

    it("maps css to CSS", () => {
      expect(LANGUAGE_MAP.css).toBe("CSS");
    });
  });

  describe("LANGUAGE_KEYS", () => {
    it("is a sorted array", () => {
      const sorted = [...LANGUAGE_KEYS].sort();
      expect(LANGUAGE_KEYS).toEqual(sorted);
    });

    it("contains common languages", () => {
      expect(LANGUAGE_KEYS).toContain("javascript");
      expect(LANGUAGE_KEYS).toContain("typescript");
      expect(LANGUAGE_KEYS).toContain("python");
      expect(LANGUAGE_KEYS).toContain("css");
    });
  });

  describe("getLanguageDisplayName", () => {
    it("returns friendly name for known key", () => {
      expect(getLanguageDisplayName("javascript")).toBe("JavaScript");
    });

    it("returns key itself for unknown key", () => {
      expect(getLanguageDisplayName("not-a-language")).toBe("not-a-language");
    });
  });

  describe("normalizeLanguage", () => {
    it("normalizes javascript to js (Lexical canonical key)", () => {
      expect(normalizeLanguage("javascript")).toBe("js");
    });

    it("keeps ts as typescript", () => {
      expect(normalizeLanguage("ts")).toBe("typescript");
    });

    it("normalizes python to py (Lexical canonical key)", () => {
      expect(normalizeLanguage("python")).toBe("py");
    });

    it("returns input unchanged for already-canonical keys", () => {
      expect(normalizeLanguage("css")).toBe("css");
    });
  });

  describe("searchLanguages", () => {
    it("returns all languages for empty query", () => {
      const results = searchLanguages("");
      expect(results.length).toBeGreaterThan(0);
    });

    it("filters by partial match on key", () => {
      const results = searchLanguages("java");
      expect(results.some((r) => r.key === "javascript")).toBe(true);
      expect(results.some((r) => r.key === "java")).toBe(true);
    });

    it("is case-insensitive", () => {
      const lower = searchLanguages("python");
      const upper = searchLanguages("PYTHON");
      expect(lower).toEqual(upper);
    });

    it("deduplicates by display name", () => {
      const results = searchLanguages("");
      const labels = results.map((r) => r.label.toLowerCase());
      const uniqueLabels = new Set(labels);
      expect(labels.length).toBe(uniqueLabels.size);
    });

    it("returns empty array for gibberish query", () => {
      const results = searchLanguages("xyzzy123gibberish");
      expect(results).toHaveLength(0);
    });

    it("filters by friendly name", () => {
      const results = searchLanguages("Script");
      expect(results.some((r) => r.label.includes("Script"))).toBe(true);
    });

    it("accepts custom keys parameter", () => {
      const results = searchLanguages("", ["javascript", "python"]);
      expect(results.length).toBeLessThanOrEqual(2);
    });
  });
});
