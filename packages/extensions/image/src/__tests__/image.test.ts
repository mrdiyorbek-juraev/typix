import { describe, expect, it } from "vitest";
import { configExtension } from "lexical";
import { getTypixMeta } from "@typix-editor/core";
import { ImageExtension } from "../extension";

describe("ImageExtension", () => {
  describe("static extension", () => {
    it("is a valid extension definition", () => {
      expect(ImageExtension.name).toBe("@typix/image");
      expect(ImageExtension.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      expect(ImageExtension.config?.disabled).toBe(false);
    });

    it("sets maxWidth to 800 by default", () => {
      expect(ImageExtension.config?.maxWidth).toBe(800);
    });

    it("leaves component undefined by default", () => {
      expect(ImageExtension.config?.component).toBeUndefined();
    });

    it("accepts user overrides via configExtension", () => {
      const [, override] = configExtension(ImageExtension, {
        disabled: true,
        maxWidth: 1200,
        allowedTypes: ["image/png", "image/jpeg"],
      });
      expect(override.disabled).toBe(true);
      expect(override.maxWidth).toBe(1200);
      expect(override.allowedTypes).toEqual(["image/png", "image/jpeg"]);
    });

    it("merges partial config with defaults via mergeConfig", () => {
      const merged = ImageExtension.mergeConfig!(ImageExtension.config!, {
        maxWidth: 1200,
      });
      expect(merged.disabled).toBe(false);
      expect(merged.maxWidth).toBe(1200);
    });
  });

  describe("config callbacks", () => {
    it("accepts onInsert callback via configExtension", () => {
      const handler = () => {};
      const [, override] = configExtension(ImageExtension, {
        onInsert: handler,
      });
      expect(override.onInsert).toBe(handler);
    });

    it("accepts onDelete callback via configExtension", () => {
      const handler = () => {};
      const [, override] = configExtension(ImageExtension, {
        onDelete: handler,
      });
      expect(override.onDelete).toBe(handler);
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
      expect(
        Object.keys(getTypixMeta(ImageExtension)?.commands ?? {})
      ).toHaveLength(5);
    });

    it.each(commandNames)("registers %s command", (name) => {
      expect(getTypixMeta(ImageExtension)?.commands).toHaveProperty(name);
    });
  });
});
