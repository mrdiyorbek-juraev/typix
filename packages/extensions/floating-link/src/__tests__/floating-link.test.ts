import { describe, expect, it } from "vitest";
import { configExtension } from "lexical";
import { getExtensionOutput } from "@typix-editor/core";
import { FloatingLinkExtension } from "../extension";

describe("FloatingLinkExtension", () => {
  describe("static extension", () => {
    it("is a valid extension definition", () => {
      expect(FloatingLinkExtension.name).toBe("@typix/floating-link");
      expect(FloatingLinkExtension.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      expect(FloatingLinkExtension.config?.disabled).toBe(false);
    });

    it("sets openInNewTab to true by default", () => {
      expect(FloatingLinkExtension.config?.openInNewTab).toBe(true);
    });

    it("accepts disabled override via configExtension", () => {
      const [, override] = configExtension(FloatingLinkExtension, {
        disabled: true,
      });
      expect(override.disabled).toBe(true);
    });

    it("accepts openInNewTab override via configExtension", () => {
      const [, override] = configExtension(FloatingLinkExtension, {
        openInNewTab: false,
      });
      expect(override.openInNewTab).toBe(false);
    });

    it("merges partial config with defaults via mergeConfig", () => {
      const merged = FloatingLinkExtension.mergeConfig!(
        FloatingLinkExtension.config!,
        { disabled: true }
      );
      expect(merged.disabled).toBe(true);
      expect(merged.openInNewTab).toBe(true);
    });
  });

  describe("getExtensionOutput", () => {
    it("returns undefined for an unregistered editor", () => {
      const result = getExtensionOutput({} as any, FloatingLinkExtension);
      expect(result).toBeUndefined();
    });
  });
});
