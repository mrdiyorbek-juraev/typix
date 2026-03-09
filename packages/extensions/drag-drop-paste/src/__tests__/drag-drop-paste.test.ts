import { describe, expect, it } from "vitest";
import { DragDropPasteExtension } from "../extension";

describe("DragDropPasteExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = DragDropPasteExtension();
      expect(ext.name).toBe("@typix/drag-drop-paste");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = DragDropPasteExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("leaves acceptedTypes undefined by default", () => {
      const ext = DragDropPasteExtension();
      expect(ext.config?.acceptedTypes).toBeUndefined();
    });

    it("leaves maxFileSize undefined by default", () => {
      const ext = DragDropPasteExtension();
      expect(ext.config?.maxFileSize).toBeUndefined();
    });

    it("accepts user overrides", () => {
      const ext = DragDropPasteExtension({
        disabled: true,
        acceptedTypes: ["image/png"],
        maxFileSize: 5 * 1024 * 1024,
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.acceptedTypes).toEqual(["image/png"]);
      expect(ext.config?.maxFileSize).toBe(5 * 1024 * 1024);
    });
  });

  describe("config callbacks", () => {
    it("accepts onFilesAdded callback", () => {
      const handler = async () => [];
      const ext = DragDropPasteExtension({ onFilesAdded: handler });
      expect(ext.config?.onFilesAdded).toBe(handler);
    });

    it("accepts onValidationError callback", () => {
      const handler = () => {};
      const ext = DragDropPasteExtension({ onValidationError: handler });
      expect(ext.config?.onValidationError).toBe(handler);
    });

    it("accepts transformResult callback", () => {
      const handler = (_file: File, result: string) => ({
        src: result,
        altText: "test",
      });
      const ext = DragDropPasteExtension({ transformResult: handler });
      expect(ext.config?.transformResult).toBe(handler);
    });
  });
});
