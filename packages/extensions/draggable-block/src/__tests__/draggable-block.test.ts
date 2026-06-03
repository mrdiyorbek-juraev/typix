import { describe, expect, it } from "vitest";
import { DraggableBlockExtension } from "../extension";

describe("DraggableBlockExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = DraggableBlockExtension();
      expect(ext.name).toBe("@typix/draggable-block");
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets disabled to false by default", () => {
      const ext = DraggableBlockExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("accepts disabled override", () => {
      const ext = DraggableBlockExtension({ disabled: true });
      expect(ext.config?.disabled).toBe(true);
    });
  });
});
