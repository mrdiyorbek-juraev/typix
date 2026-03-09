import { describe, expect, it } from "vitest";
import { CodeHighlightPrismExtension } from "../extension";

describe("CodeHighlightPrismExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = CodeHighlightPrismExtension();
      expect(ext.name).toBe("@typix/code-highlight-prism");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = CodeHighlightPrismExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("leaves defaultLanguage undefined by default", () => {
      const ext = CodeHighlightPrismExtension();
      expect(ext.config?.defaultLanguage).toBeUndefined();
    });

    it("accepts user overrides", () => {
      const ext = CodeHighlightPrismExtension({
        disabled: true,
        defaultLanguage: "typescript",
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.defaultLanguage).toBe("typescript");
    });
  });
});
