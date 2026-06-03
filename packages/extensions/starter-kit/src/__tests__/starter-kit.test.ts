import { describe, expect, it } from "vitest";
import {
  getTypixExtensionMeta,
  type AnyLexicalExtension,
} from "@typix-editor/core";
import type { TypixShortcut } from "@typix-editor/core";
import { StarterKit } from "../starter-kit";

// StarterKit returns a single Lexical extension whose `dependencies` carry the
// per-sub-extension Typix metadata. Aggregate by walking deps the same way
// createTypix() does internally.
function walkDeps(
  ext: AnyLexicalExtension,
  seen: WeakSet<AnyLexicalExtension> = new WeakSet()
): AnyLexicalExtension[] {
  if (seen.has(ext)) return [];
  seen.add(ext);
  const out: AnyLexicalExtension[] = [ext];
  const deps = (
    ext as { dependencies?: Array<AnyLexicalExtension | [AnyLexicalExtension]> }
  ).dependencies;
  if (deps) {
    for (const dep of deps) {
      const base = Array.isArray(dep) ? dep[0] : dep;
      out.push(...walkDeps(base, seen));
    }
  }
  return out;
}

function collectCommands(ext: AnyLexicalExtension): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const e of walkDeps(ext)) {
    const record = getTypixExtensionMeta(e)?.commands?.();
    if (record) Object.assign(result, record);
  }
  return result;
}

function collectShortcuts(ext: AnyLexicalExtension): TypixShortcut[] {
  const result: TypixShortcut[] = [];
  for (const e of walkDeps(ext)) {
    const meta = getTypixExtensionMeta(e);
    if (meta?.shortcuts.length) result.push(...meta.shortcuts);
  }
  return result;
}

describe("StarterKit", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = StarterKit();
      expect(ext.name).toBe("@typix/starter-kit");
    });
  });

  describe("default preset (full)", () => {
    it("includes commands from all sub-extensions", () => {
      const commands = collectCommands(StarterKit());
      expect(Object.keys(commands).length).toBeGreaterThan(0);
    });

    it("includes bold commands", () => {
      expect(collectCommands(StarterKit())).toHaveProperty("toggleBold");
    });

    it("includes italic commands", () => {
      expect(collectCommands(StarterKit())).toHaveProperty("toggleItalic");
    });

    it("includes heading commands", () => {
      const commands = collectCommands(StarterKit());
      expect(commands).toHaveProperty("toggleHeading");
      expect(commands).toHaveProperty("setHeading");
    });

    it("includes underline commands", () => {
      expect(collectCommands(StarterKit())).toHaveProperty("toggleUnderline");
    });

    it("includes strike commands", () => {
      expect(collectCommands(StarterKit())).toHaveProperty("toggleStrike");
    });

    it("includes history commands", () => {
      const commands = collectCommands(StarterKit());
      expect(commands).toHaveProperty("undo");
      expect(commands).toHaveProperty("redo");
    });

    it("includes shortcuts from all sub-extensions", () => {
      const shortcuts = collectShortcuts(StarterKit());
      expect(shortcuts.length).toBeGreaterThan(0);
    });

    it("includes bold shortcut (Cmd+B)", () => {
      expect(collectShortcuts(StarterKit())).toEqual(
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
      const commands = collectCommands(StarterKit({ preset: "minimal" }));
      expect(commands).toHaveProperty("toggleBold");
      expect(commands).toHaveProperty("toggleItalic");
    });

    it("includes heading commands", () => {
      expect(collectCommands(StarterKit({ preset: "minimal" }))).toHaveProperty(
        "toggleHeading"
      );
    });

    it("includes history commands", () => {
      const commands = collectCommands(StarterKit({ preset: "minimal" }));
      expect(commands).toHaveProperty("undo");
      expect(commands).toHaveProperty("redo");
    });

    it("excludes underline commands", () => {
      expect(
        collectCommands(StarterKit({ preset: "minimal" }))
      ).not.toHaveProperty("toggleUnderline");
    });

    it("excludes strike commands", () => {
      expect(
        collectCommands(StarterKit({ preset: "minimal" }))
      ).not.toHaveProperty("toggleStrike");
    });

    it("excludes list commands", () => {
      expect(
        collectCommands(StarterKit({ preset: "minimal" }))
      ).not.toHaveProperty("toggleBulletList");
    });
  });

  describe("blog preset", () => {
    it("includes bold, italic, underline, strike commands", () => {
      const commands = collectCommands(StarterKit({ preset: "blog" }));
      expect(commands).toHaveProperty("toggleBold");
      expect(commands).toHaveProperty("toggleItalic");
      expect(commands).toHaveProperty("toggleUnderline");
      expect(commands).toHaveProperty("toggleStrike");
    });

    it("includes blockquote and list commands", () => {
      expect(collectCommands(StarterKit({ preset: "blog" }))).toHaveProperty(
        "toggleBlockquote"
      );
    });

    it("includes link commands", () => {
      const commands = collectCommands(StarterKit({ preset: "blog" }));
      expect(commands).toHaveProperty("setLink");
      expect(commands).toHaveProperty("unsetLink");
    });

    it("includes history commands", () => {
      const commands = collectCommands(StarterKit({ preset: "blog" }));
      expect(commands).toHaveProperty("undo");
      expect(commands).toHaveProperty("redo");
    });

    it("excludes subscript/superscript commands", () => {
      const commands = collectCommands(StarterKit({ preset: "blog" }));
      expect(commands).not.toHaveProperty("toggleSubscript");
      expect(commands).not.toHaveProperty("toggleSuperscript");
    });
  });

  describe("disabling extensions", () => {
    it("excludes bold commands when bold is false", () => {
      expect(collectCommands(StarterKit({ bold: false }))).not.toHaveProperty(
        "toggleBold"
      );
    });

    it("excludes italic commands when italic is false", () => {
      expect(collectCommands(StarterKit({ italic: false }))).not.toHaveProperty(
        "toggleItalic"
      );
    });

    it("excludes heading commands when heading is false", () => {
      const commands = collectCommands(StarterKit({ heading: false }));
      expect(commands).not.toHaveProperty("toggleHeading");
      expect(commands).not.toHaveProperty("setHeading");
    });

    it("excludes bold shortcut when bold is false", () => {
      const boldShortcuts = collectShortcuts(
        StarterKit({ bold: false })
      ).filter((s) => s.command === "toggleBold");
      expect(boldShortcuts).toHaveLength(0);
    });
  });

  describe("explicit options override preset", () => {
    it("can re-enable an extension disabled by preset", () => {
      // minimal preset disables underline, but explicit option overrides
      const ext = StarterKit({ preset: "minimal", underline: {} });
      expect(collectCommands(ext)).toHaveProperty("toggleUnderline");
    });

    it("can disable an extension enabled by preset", () => {
      // blog preset enables underline, but explicit false overrides
      const ext = StarterKit({ preset: "blog", underline: false });
      expect(collectCommands(ext)).not.toHaveProperty("toggleUnderline");
    });
  });
});
