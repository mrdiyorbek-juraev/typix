import { describe, expect, it } from "vitest";
import { configExtension } from "lexical";
import { getTypixExtensionMeta } from "@typix-editor/core";
import { LinkExtension } from "../extension";

describe("LinkExtension", () => {
  describe("static extension", () => {
    it("is a valid extension definition", () => {
      expect(LinkExtension.name).toBe("@typix/link");
      expect(LinkExtension.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      expect(LinkExtension.config?.disabled).toBe(false);
    });

    it("leaves validateUrl undefined by default", () => {
      expect(LinkExtension.config?.validateUrl).toBeUndefined();
    });

    it("leaves attributes undefined by default", () => {
      expect(LinkExtension.config?.attributes).toBeUndefined();
    });

    it("accepts user overrides via configExtension", () => {
      const validator = (url: string) => url.startsWith("https://");
      const [, override] = configExtension(LinkExtension, {
        disabled: true,
        validateUrl: validator,
      });
      expect(override.disabled).toBe(true);
      expect(override.validateUrl).toBe(validator);
    });

    it("merges partial config with defaults via mergeConfig", () => {
      const validator = (url: string) => url.startsWith("https://");
      const merged = LinkExtension.mergeConfig!(LinkExtension.config!, {
        validateUrl: validator,
      });
      expect(merged.disabled).toBe(false);
      expect(merged.validateUrl).toBe(validator);
    });
  });

  describe("commands", () => {
    it("registers setLink command", () => {
      expect(getTypixExtensionMeta(LinkExtension)?.commands?.()).toHaveProperty(
        "setLink"
      );
    });

    it("registers unsetLink command", () => {
      expect(getTypixExtensionMeta(LinkExtension)?.commands?.()).toHaveProperty(
        "unsetLink"
      );
    });
  });
});
