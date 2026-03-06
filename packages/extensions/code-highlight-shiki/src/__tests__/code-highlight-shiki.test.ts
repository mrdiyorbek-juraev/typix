import { describe, expect, it } from "vitest";
import { CodeHighlightShikiExtension } from "../extension";

describe("CodeHighlightShikiExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = CodeHighlightShikiExtension();
      expect(ext.name).toBe("code-highlight-shiki");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = CodeHighlightShikiExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("leaves defaultLanguage undefined by default", () => {
      const ext = CodeHighlightShikiExtension();
      expect(ext.config?.defaultLanguage).toBeUndefined();
    });

    it("accepts user overrides", () => {
      const ext = CodeHighlightShikiExtension({
        disabled: true,
        defaultLanguage: "python",
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.defaultLanguage).toBe("python");
    });
  });
});
