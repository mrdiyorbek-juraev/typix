import { describe, expect, it } from "vitest";
import { getTypixMeta } from "@typix-editor/core";
import { StarterKit } from "../starter-kit";

describe("StarterKit", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = StarterKit();
      expect(ext.name).toBe("@typix/starter-kit");
    });
  });

  describe("default preset (full)", () => {
    it("includes commands from all sub-extensions", () => {
      const ext = StarterKit();
      const commands = Object.keys(getTypixMeta(ext)?.commands ?? {});
      expect(commands.length).toBeGreaterThan(0);
    });

    it("includes bold commands", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleBold");
    });

    it("includes italic commands", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleItalic");
    });

    it("includes heading commands", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleHeading");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("setHeading");
    });

    it("includes underline commands", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleUnderline");
    });

    it("includes strike commands", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleStrike");
    });

    it("includes history commands", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.commands).toHaveProperty("undo");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("redo");
    });

    it("includes shortcuts from all sub-extensions", () => {
      const ext = StarterKit();
      const shortcuts = getTypixMeta(ext)?.shortcuts;
      expect(shortcuts).toBeDefined();
      expect(shortcuts!.length).toBeGreaterThan(0);
    });

    it("includes bold shortcut (Cmd+B)", () => {
      const ext = StarterKit();
      expect(getTypixMeta(ext)?.shortcuts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "b",
            modifiers: ["mod"],
            command: "toggleBold",
          }),
        ])
      );
    });
  });

  describe("minimal preset", () => {
    it("includes bold and italic commands", () => {
      const ext = StarterKit({ preset: "minimal" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleBold");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleItalic");
    });

    it("includes heading commands", () => {
      const ext = StarterKit({ preset: "minimal" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleHeading");
    });

    it("includes history commands", () => {
      const ext = StarterKit({ preset: "minimal" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("undo");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("redo");
    });

    it("excludes underline commands", () => {
      const ext = StarterKit({ preset: "minimal" });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleUnderline");
    });

    it("excludes strike commands", () => {
      const ext = StarterKit({ preset: "minimal" });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleStrike");
    });

    it("excludes list commands", () => {
      const ext = StarterKit({ preset: "minimal" });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty(
        "toggleBulletList"
      );
    });
  });

  describe("blog preset", () => {
    it("includes bold, italic, underline, strike commands", () => {
      const ext = StarterKit({ preset: "blog" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleBold");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleItalic");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleUnderline");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleStrike");
    });

    it("includes blockquote and list commands", () => {
      const ext = StarterKit({ preset: "blog" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleBlockquote");
    });

    it("includes link commands", () => {
      const ext = StarterKit({ preset: "blog" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("setLink");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("unsetLink");
    });

    it("includes history commands", () => {
      const ext = StarterKit({ preset: "blog" });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("undo");
      expect(getTypixMeta(ext)?.commands).toHaveProperty("redo");
    });

    it("excludes subscript/superscript commands", () => {
      const ext = StarterKit({ preset: "blog" });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleSubscript");
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty(
        "toggleSuperscript"
      );
    });
  });

  describe("disabling extensions", () => {
    it("excludes bold commands when bold is false", () => {
      const ext = StarterKit({ bold: false });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleBold");
    });

    it("excludes italic commands when italic is false", () => {
      const ext = StarterKit({ italic: false });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleItalic");
    });

    it("excludes heading commands when heading is false", () => {
      const ext = StarterKit({ heading: false });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleHeading");
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("setHeading");
    });

    it("excludes bold shortcut when bold is false", () => {
      const ext = StarterKit({ bold: false });
      const boldShortcuts = getTypixMeta(ext)?.shortcuts?.filter(
        (s) => s.command === "toggleBold"
      );
      expect(boldShortcuts).toHaveLength(0);
    });
  });

  describe("explicit options override preset", () => {
    it("can re-enable an extension disabled by preset", () => {
      // minimal preset disables underline, but explicit option overrides
      const ext = StarterKit({ preset: "minimal", underline: {} });
      expect(getTypixMeta(ext)?.commands).toHaveProperty("toggleUnderline");
    });

    it("can disable an extension enabled by preset", () => {
      // blog preset enables underline, but explicit false overrides
      const ext = StarterKit({ preset: "blog", underline: false });
      expect(getTypixMeta(ext)?.commands).not.toHaveProperty("toggleUnderline");
    });
  });
});
