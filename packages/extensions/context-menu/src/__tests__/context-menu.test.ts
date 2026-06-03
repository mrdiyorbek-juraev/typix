import { describe, expect, it } from "vitest";
import { ContextMenuExtension } from "../extension";

describe("ContextMenuExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = ContextMenuExtension();
      expect(ext.name).toBe("@typix/context-menu");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = ContextMenuExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("accepts disabled override", () => {
      const ext = ContextMenuExtension({ disabled: true });
      expect(ext.config?.disabled).toBe(true);
    });
  });
});
