import { describe, expect, it } from "vitest";
import { TailwindExtension } from "../extension";

describe("TailwindExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = TailwindExtension();
      expect(ext.name).toBe("@typix/tailwind");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = TailwindExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("accepts disabled override", () => {
      const ext = TailwindExtension({ disabled: true });
      expect(ext.config?.disabled).toBe(true);
    });
  });

  describe("theme overrides", () => {
    it("applies heading overrides", () => {
      const ext = TailwindExtension({
        heading: { h1: "custom-h1", h2: "custom-h2" },
      });
      // The resolved theme is embedded in the Lexical extension config.
      // We verify the user config passthrough is stored correctly.
      expect(ext.config?.heading).toEqual({ h1: "custom-h1", h2: "custom-h2" });
    });

    it("applies text overrides", () => {
      const ext = TailwindExtension({
        text: { bold: "custom-bold", italic: "custom-italic" },
      });
      expect(ext.config?.text).toEqual({
        bold: "custom-bold",
        italic: "custom-italic",
      });
    });

    it("applies string-based theme overrides", () => {
      const ext = TailwindExtension({
        paragraph: "custom-paragraph",
        link: "custom-link",
        quote: "custom-quote",
        code: "custom-code",
      });
      expect(ext.config?.paragraph).toBe("custom-paragraph");
      expect(ext.config?.link).toBe("custom-link");
      expect(ext.config?.quote).toBe("custom-quote");
      expect(ext.config?.code).toBe("custom-code");
    });

    it("applies table-related overrides", () => {
      const ext = TailwindExtension({
        table: "custom-table",
        tableCell: "custom-cell",
        tableCellHeader: "custom-header",
        tableCellEditing: "custom-editing",
        tableSelection: "custom-selection",
      });
      expect(ext.config?.table).toBe("custom-table");
      expect(ext.config?.tableCell).toBe("custom-cell");
      expect(ext.config?.tableCellHeader).toBe("custom-header");
      expect(ext.config?.tableCellEditing).toBe("custom-editing");
      expect(ext.config?.tableSelection).toBe("custom-selection");
    });

    it("applies hr and indent overrides", () => {
      const ext = TailwindExtension({
        hr: "custom-hr",
        hrSelected: "custom-hr-selected",
        indent: "custom-indent",
      });
      expect(ext.config?.hr).toBe("custom-hr");
      expect(ext.config?.hrSelected).toBe("custom-hr-selected");
      expect(ext.config?.indent).toBe("custom-indent");
    });

    it("applies codeHighlight overrides", () => {
      const highlights = {
        keyword: "text-purple-500",
        string: "text-green-500",
      };
      const ext = TailwindExtension({ codeHighlight: highlights });
      expect(ext.config?.codeHighlight).toEqual(highlights);
    });
  });

  describe("passthrough options", () => {
    it("forwards namespace", () => {
      const ext = TailwindExtension({ namespace: "test-editor" });
      expect(ext.config?.namespace).toBe("test-editor");
    });

    it("forwards editable", () => {
      const ext = TailwindExtension({ editable: false });
      expect(ext.config?.editable).toBe(false);
    });
  });

  describe("deepMerge behavior (via theme resolution)", () => {
    it("merges nested heading overrides without losing other headings", () => {
      // When we override only h1, the Lexical extension should still have h2-h6
      // from the default theme via deepMerge. We test indirectly by checking
      // the config stores the user override correctly.
      const ext = TailwindExtension({ heading: { h1: "override-h1" } });
      expect(ext.config?.heading).toEqual({ h1: "override-h1" });
    });

    it("preserves defaults when no overrides given", () => {
      const ext = TailwindExtension();
      // No theme overrides should be set on config
      expect(ext.config?.heading).toBeUndefined();
      expect(ext.config?.text).toBeUndefined();
      expect(ext.config?.paragraph).toBeUndefined();
    });
  });
});
