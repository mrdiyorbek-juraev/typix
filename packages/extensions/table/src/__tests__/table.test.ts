import { describe, expect, it } from "vitest";
import { TableExtension } from "../extension";

describe("TableExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = TableExtension();
      expect(ext.name).toBe("table");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false", () => {
      const ext = TableExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("enables cell merge by default", () => {
      const ext = TableExtension();
      expect(ext.config?.hasCellMerge).toBe(true);
    });

    it("enables cell background color by default", () => {
      const ext = TableExtension();
      expect(ext.config?.hasCellBackgroundColor).toBe(true);
    });

    it("enables tab handler by default", () => {
      const ext = TableExtension();
      expect(ext.config?.hasTabHandler).toBe(true);
    });

    it("enables horizontal scroll by default", () => {
      const ext = TableExtension();
      expect(ext.config?.hasHorizontalScroll).toBe(true);
    });

    it("disables nested tables by default", () => {
      const ext = TableExtension();
      expect(ext.config?.hasNestedTables).toBe(false);
    });

    it("enables scroll shadow by default", () => {
      const ext = TableExtension();
      expect(ext.config?.scrollShadow).toBe(true);
    });

    it("uses correct default scrollable wrapper class", () => {
      const ext = TableExtension();
      expect(ext.config?.scrollableWrapperClass).toBe(
        "typix-table-scrollable-wrapper"
      );
    });

    it("accepts user overrides", () => {
      const ext = TableExtension({
        hasCellMerge: false,
        hasNestedTables: true,
        defaultRows: 5,
        defaultColumns: 4,
      });
      expect(ext.config?.hasCellMerge).toBe(false);
      expect(ext.config?.hasNestedTables).toBe(true);
      expect(ext.config?.defaultRows).toBe(5);
      expect(ext.config?.defaultColumns).toBe(4);
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
      const ext = TableExtension();
      expect(Object.keys(ext.commands ?? {})).toHaveLength(19);
    });

    it.each(commandNames)("registers %s command", (name) => {
      const ext = TableExtension();
      expect(ext.commands).toHaveProperty(name);
    });
  });
});
