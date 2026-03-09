import { describe, expect, it } from "vitest";
import { MarkdownShortcutsExtension } from "../extension";

describe("MarkdownShortcutsExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = MarkdownShortcutsExtension();
      expect(ext.name).toBe("@typix/markdown-shortcuts");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = MarkdownShortcutsExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("populates transformers array by default", () => {
      const ext = MarkdownShortcutsExtension();
      expect(ext.config?.transformers).toBeDefined();
      expect(Array.isArray(ext.config?.transformers)).toBe(true);
      expect(ext.config?.transformers.length).toBeGreaterThan(0);
    });

    it("accepts user overrides", () => {
      const ext = MarkdownShortcutsExtension({ disabled: true });
      expect(ext.config?.disabled).toBe(true);
    });

    it("accepts custom transformers", () => {
      const customTransformers = [{ type: "element" as const }] as any[];
      const ext = MarkdownShortcutsExtension({
        transformers: customTransformers,
      });
      expect(ext.config?.transformers).toBe(customTransformers);
    });
  });
});
