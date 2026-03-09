import { describe, expect, it } from "vitest";
import { configExtension } from "lexical";
import { getTypixMeta } from "@typix-editor/core";
import { TableExtension } from "../extension";

describe("TableExtension", () => {
  describe("static extension", () => {
    it("is a valid extension definition", () => {
      expect(TableExtension.name).toBe("@typix/table");
      expect(TableExtension.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false", () => {
      expect(TableExtension.config?.disabled).toBe(false);
    });

    it("enables cell merge by default", () => {
      expect(TableExtension.config?.hasCellMerge).toBe(true);
    });

    it("enables cell background color by default", () => {
      expect(TableExtension.config?.hasCellBackgroundColor).toBe(true);
    });

    it("enables tab handler by default", () => {
      expect(TableExtension.config?.hasTabHandler).toBe(true);
    });

    it("enables horizontal scroll by default", () => {
      expect(TableExtension.config?.hasHorizontalScroll).toBe(true);
    });

    it("disables nested tables by default", () => {
      expect(TableExtension.config?.hasNestedTables).toBe(false);
    });

    it("enables scroll shadow by default", () => {
      expect(TableExtension.config?.scrollShadow).toBe(true);
    });

    it("uses correct default scrollable wrapper class", () => {
      expect(TableExtension.config?.scrollableWrapperClass).toBe(
        "typix-table-scrollable-wrapper"
      );
    });

    it("accepts user overrides via configExtension", () => {
      const [, override] = configExtension(TableExtension, {
        hasCellMerge: false,
        hasNestedTables: true,
        defaultRows: 5,
        defaultColumns: 4,
      });
      expect(override.hasCellMerge).toBe(false);
      expect(override.hasNestedTables).toBe(true);
      expect(override.defaultRows).toBe(5);
      expect(override.defaultColumns).toBe(4);
    });

    it("merges partial config with defaults via mergeConfig", () => {
      const merged = TableExtension.mergeConfig!(TableExtension.config!, {
        hasCellMerge: false,
        defaultRows: 5,
      });
      expect(merged.hasCellMerge).toBe(false);
      expect(merged.defaultRows).toBe(5);
      expect(merged.disabled).toBe(false);
      expect(merged.scrollShadow).toBe(true);
    });
  });

  describe("commands", () => {
    const commandNames = [
      "insertTable",
      "insertRowAbove",
      "insertRowBelow",
      "insertColumnLeft",
      "insertColumnRight",
      "deleteRow",
      "deleteColumn",
      "deleteTable",
      "unmergeCells",
      "toggleHeaderRow",
      "toggleHeaderColumn",
      "clearCellContents",
      "clearRowContents",
      "clearColumnContents",
      "duplicateRow",
      "duplicateColumn",
      "setCellBackgroundColor",
      "setRowBackgroundColor",
      "setColumnBackgroundColor",
    ];

    it("registers all 19 commands", () => {
      expect(
        Object.keys(getTypixMeta(TableExtension)?.commands ?? {})
      ).toHaveLength(19);
    });

    it.each(commandNames)("registers %s command", (name) => {
      expect(getTypixMeta(TableExtension)?.commands).toHaveProperty(name);
    });
  });
});
