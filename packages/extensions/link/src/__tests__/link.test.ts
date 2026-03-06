import { describe, expect, it } from "vitest";
import { LinkExtension } from "../extension";

describe("LinkExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = LinkExtension();
      expect(ext.name).toBe("link");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = LinkExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("leaves validateUrl undefined by default", () => {
      const ext = LinkExtension();
      expect(ext.config?.validateUrl).toBeUndefined();
    });

    it("leaves attributes undefined by default", () => {
      const ext = LinkExtension();
      expect(ext.config?.attributes).toBeUndefined();
    });

    it("accepts user overrides", () => {
      const validator = (url: string) => url.startsWith("https://");
      const ext = LinkExtension({
        disabled: true,
        validateUrl: validator,
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.validateUrl).toBe(validator);
    });
  });

  describe("commands", () => {
    it("registers setLink command", () => {
      const ext = LinkExtension();
      expect(ext.commands).toHaveProperty("setLink");
    });

    it("registers unsetLink command", () => {
      const ext = LinkExtension();
      expect(ext.commands).toHaveProperty("unsetLink");
    });
  });
});
