import { describe, expect, it } from "vitest";
import { configExtension } from "lexical";
import { getTypixExtensionMeta, getExtensionOutput } from "@typix-editor/core";
import {
  PrettierFormatterExtension,
  canFormatWithPrettier,
} from "../extension";

describe("PrettierFormatterExtension", () => {
  describe("static extension", () => {
    it("is a valid extension definition", () => {
      expect(PrettierFormatterExtension.name).toBe(
        "@typix/code-block-prettier"
      );
      expect(PrettierFormatterExtension.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets printOptions to empty object by default", () => {
      expect(PrettierFormatterExtension.config?.printOptions).toEqual({});
    });

    it("accepts user overrides via configExtension", () => {
      const [, override] = configExtension(PrettierFormatterExtension, {
        printOptions: { tabWidth: 4, useTabs: true },
      });
      expect(override.printOptions).toEqual({ tabWidth: 4, useTabs: true });
    });

    it("accepts onFormat callback via configExtension", () => {
      const handler = () => {};
      const [, override] = configExtension(PrettierFormatterExtension, {
        onFormat: handler,
      });
      expect(override.onFormat).toBe(handler);
    });

    it("accepts onError callback via configExtension", () => {
      const handler = () => {};
      const [, override] = configExtension(PrettierFormatterExtension, {
        onError: handler,
      });
      expect(override.onError).toBe(handler);
    });

    it("merges partial config with defaults via mergeConfig", () => {
      const merged = PrettierFormatterExtension.mergeConfig!(
        PrettierFormatterExtension.config!,
        { printOptions: { tabWidth: 4 } }
      );
      expect(merged.printOptions).toEqual({ tabWidth: 4 });
    });
  });

  describe("commands", () => {
    it("registers formatWithPrettier command", () => {
      expect(
        getTypixExtensionMeta(PrettierFormatterExtension)?.commands?.()
      ).toHaveProperty("formatWithPrettier");
    });
  });

  describe("getExtensionOutput", () => {
    it("returns undefined for an unregistered editor", () => {
      const result = getExtensionOutput({} as any, PrettierFormatterExtension);
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
