import { describe, expect, it } from "vitest";
import { TabFocusExtension } from "../extension";

describe("TabFocusExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = TabFocusExtension();
      expect(ext.name).toBe("@typix/tab-focus");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = TabFocusExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("sets restoreWindowMs to 100 by default", () => {
      const ext = TabFocusExtension();
      expect(ext.config?.restoreWindowMs).toBe(100);
    });

    it("accepts user overrides", () => {
      const ext = TabFocusExtension({
        disabled: true,
        restoreWindowMs: 200,
      });
      expect(ext.config?.disabled).toBe(true);
      expect(ext.config?.restoreWindowMs).toBe(200);
    });
  });
});
