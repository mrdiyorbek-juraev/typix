import { describe, expect, it } from "vitest";
import { ImageExtension } from "../extension";

describe("ImageExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = ImageExtension();
      expect(ext.name).toBe("image");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = ImageExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("sets maxWidth to 800 by default", () => {
      const ext = ImageExtension();
      expect(ext.config?.maxWidth).toBe(800);
    });

    it("leaves component undefined by default", () => {
      const ext = ImageExtension();
      expect(ext.config?.component).toBeUndefined();
    });

    it("accepts user overrides", () => {
      const ext = ImageExtension({
        disabled: true,
        maxWidth: 1200,
        allowedTypes: ["image/png", "image/jpeg"],
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.maxWidth).toBe(1200);
      expect(ext.config?.allowedTypes).toEqual(["image/png", "image/jpeg"]);
    });
  });

  describe("config callbacks", () => {
    it("accepts onInsert callback", () => {
      const handler = () => {};
      const ext = ImageExtension({ onInsert: handler });
      expect(ext.config?.onInsert).toBe(handler);
    });

    it("accepts onDelete callback", () => {
      const handler = () => {};
      const ext = ImageExtension({ onDelete: handler });
      expect(ext.config?.onDelete).toBe(handler);
    });
  });

  describe("commands", () => {
    const commandNames = [
      "insertImage",
      "setImageAlignment",
      "toggleImageCaption",
      "deleteImage",
      "duplicateImage",
    ];

    it("registers all 5 commands", () => {
      const ext = ImageExtension();
      expect(Object.keys(ext.commands ?? {})).toHaveLength(5);
    });

    it.each(commandNames)("registers %s command", (name) => {
      const ext = ImageExtension();
      expect(ext.commands).toHaveProperty(name);
    });
  });
});
