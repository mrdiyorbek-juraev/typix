import { describe, expect, it } from "vitest";
import { FloatingLinkExtension, getFloatingLinkOutput } from "../extension";

describe("FloatingLinkExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = FloatingLinkExtension();
      expect(ext.name).toBe("floating-link");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = FloatingLinkExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("sets openInNewTab to true by default", () => {
      const ext = FloatingLinkExtension();
      expect(ext.config?.openInNewTab).toBe(true);
    });

    it("accepts disabled override", () => {
      const ext = FloatingLinkExtension({ disabled: true });
      expect(ext.config?.disabled).toBe(true);
    });

    it("accepts openInNewTab override", () => {
      const ext = FloatingLinkExtension({ openInNewTab: false });
      expect(ext.config?.openInNewTab).toBe(false);
    });
  });

  describe("getFloatingLinkOutput", () => {
    it("returns undefined for an unregistered editor", () => {
      const result = getFloatingLinkOutput({} as any);
      expect(result).toBeUndefined();
    });
  });
});
