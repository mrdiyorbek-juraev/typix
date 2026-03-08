import { describe, it, expect } from "vitest";
import { defaultTheme } from "../theme";

describe("defaultTheme", () => {
  it("is a non-null object", () => {
    expect(defaultTheme).toBeDefined();
    expect(typeof defaultTheme).toBe("object");
  });

  it("has all required top-level keys", () => {
    const requiredKeys = [
      "paragraph",
      "heading",
      "text",
      "list",
      "link",
      "quote",
      "code",
      "codeHighlight",
      "table",
      "image",
      "hr",
    ];

    for (const key of requiredKeys) {
      expect(defaultTheme).toHaveProperty(key);
    }
  });

  it("uses typix- prefix for all string values", () => {
    function checkPrefix(obj: Record<string, unknown>, path = ""): void {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof value === "string") {
          expect(value, `${fullPath} should start with "typix-"`).toMatch(
            /^typix-/
          );
        } else if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          checkPrefix(value as Record<string, unknown>, fullPath);
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "string") {
              expect(item, `${fullPath}[] should start with "typix-"`).toMatch(
                /^typix-/
              );
            }
          }
        }
      }
    }

    checkPrefix(defaultTheme as unknown as Record<string, unknown>);
  });

  it("has all six heading levels", () => {
    const heading = defaultTheme.heading as Record<string, string>;
    expect(heading.h1).toBeDefined();
    expect(heading.h2).toBeDefined();
    expect(heading.h3).toBeDefined();
    expect(heading.h4).toBeDefined();
    expect(heading.h5).toBeDefined();
    expect(heading.h6).toBeDefined();
  });

  it("has all text format classes", () => {
    const text = defaultTheme.text as Record<string, string>;
    const formats = [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "subscript",
      "superscript",
    ];
    for (const format of formats) {
      expect(text[format], `text.${format}`).toBeDefined();
    }
  });

  it("has list structure with nested support", () => {
    const list = defaultTheme.list as Record<string, unknown>;
    expect(list.listitem).toBeDefined();
    expect(list.nested).toBeDefined();
    expect((list.nested as Record<string, string>).listitem).toBeDefined();
  });
});
