import { describe, expect, it } from "vitest";
import {
  PrettierFormatterExtension,
  canFormatWithPrettier,
  getPrettierOutput,
} from "../extension";

describe("PrettierFormatterExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = PrettierFormatterExtension();
      expect(ext.name).toBe("code-block-prettier");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets printOptions to empty object by default", () => {
      const ext = PrettierFormatterExtension();
      expect(ext.config?.printOptions).toEqual({});
    });

    it("accepts user overrides", () => {
      const ext = PrettierFormatterExtension({
        printOptions: { tabWidth: 4, useTabs: true },
      });
      expect(ext.config?.printOptions).toEqual({ tabWidth: 4, useTabs: true });
    });

    it("accepts onFormat callback", () => {
      const handler = () => {};
      const ext = PrettierFormatterExtension({ onFormat: handler });
      expect(ext.config?.onFormat).toBe(handler);
    });

    it("accepts onError callback", () => {
      const handler = () => {};
      const ext = PrettierFormatterExtension({ onError: handler });
      expect(ext.config?.onError).toBe(handler);
    });
  });

  describe("commands", () => {
    it("registers formatWithPrettier command", () => {
      const ext = PrettierFormatterExtension();
      expect(ext.commands).toHaveProperty("formatWithPrettier");
    });
  });

  describe("getPrettierOutput", () => {
    it("returns undefined for an unregistered editor", () => {
      const result = getPrettierOutput({} as any);
      expect(result).toBeUndefined();
    });
  });
});

describe("canFormatWithPrettier", () => {
  describe("supported languages", () => {
    const supported = [
      "javascript",
      "js",
      "jsx",
      "typescript",
      "ts",
      "tsx",
      "css",
      "scss",
      "less",
      "html",
      "markdown",
      "md",
      "json",
      "graphql",
    ];

    it.each(supported)("returns true for %s", (lang) => {
      expect(canFormatWithPrettier(lang)).toBe(true);
    });
  });

  describe("case insensitivity", () => {
    it("handles uppercase input", () => {
      expect(canFormatWithPrettier("JavaScript")).toBe(true);
      expect(canFormatWithPrettier("CSS")).toBe(true);
      expect(canFormatWithPrettier("HTML")).toBe(true);
    });

    it("handles mixed case input", () => {
      expect(canFormatWithPrettier("TypeScript")).toBe(true);
      expect(canFormatWithPrettier("GraphQL")).toBe(true);
    });
  });

  describe("unsupported languages", () => {
    const unsupported = ["python", "rust", "go", "java", "ruby", "c", "cpp"];

    it.each(unsupported)("returns false for %s", (lang) => {
      expect(canFormatWithPrettier(lang)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(canFormatWithPrettier("")).toBe(false);
    });

    it("returns false for gibberish", () => {
      expect(canFormatWithPrettier("not-a-language")).toBe(false);
    });
  });
});
