import { describe, expect, it } from "vitest";
import { CharacterLimitExtension } from "../extension";

// Re-implement countUtf8Bytes (not exported) for testing the algorithm
function countUtf8Bytes(str: string): number {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code < 0xd800 || code >= 0xe000) bytes += 3;
    else {
      // Surrogate pair → one code point → 4 bytes
      i++;
      bytes += 4;
    }
  }
  return bytes;
}

describe("CharacterLimitExtension", () => {
  describe("factory", () => {
    it("returns a valid extension definition", () => {
      const ext = CharacterLimitExtension();
      expect(ext.name).toBe("character-limit");
      expect(ext.typix).toBeDefined();
      expect(ext.config).toBeDefined();
    });
  });

  describe("config defaults", () => {
    it("sets maxLength to 280 by default", () => {
      const ext = CharacterLimitExtension();
      expect(ext.config?.maxLength).toBe(280);
    });

    it("sets charset to UTF-16 by default", () => {
      const ext = CharacterLimitExtension();
      expect(ext.config?.charset).toBe("UTF-16");
    });

    it("sets disabled to false by default", () => {
      const ext = CharacterLimitExtension();
      expect(ext.config?.disabled).toBe(false);
    });

    it("accepts user overrides", () => {
      const ext = CharacterLimitExtension({
        maxLength: 500,
        charset: "UTF-8",
        disabled: true,
      });
      expect(ext.config?.maxLength).toBe(500);
      expect(ext.config?.charset).toBe("UTF-8");
      expect(ext.config?.disabled).toBe(true);
    });
  });
});

describe("countUtf8Bytes", () => {
  it("counts ASCII characters as 1 byte each", () => {
    expect(countUtf8Bytes("hello")).toBe(5);
    expect(countUtf8Bytes("abc")).toBe(3);
  });

  it("counts 2-byte characters correctly", () => {
    // é is U+00E9, encoded as 2 bytes in UTF-8
    expect(countUtf8Bytes("é")).toBe(2);
    expect(countUtf8Bytes("café")).toBe(5); // c(1) + a(1) + f(1) + é(2)
  });

  it("counts 3-byte characters correctly", () => {
    // 中 is U+4E2D, encoded as 3 bytes in UTF-8
    expect(countUtf8Bytes("中")).toBe(3);
    expect(countUtf8Bytes("中文")).toBe(6);
  });

  it("counts 4-byte emoji correctly", () => {
    // 😀 is U+1F600, encoded as 4 bytes in UTF-8 (surrogate pair in JS)
    expect(countUtf8Bytes("😀")).toBe(4);
  });

  it("returns 0 for empty string", () => {
    expect(countUtf8Bytes("")).toBe(0);
  });

  it("handles mixed content", () => {
    // "a" (1) + "é" (2) + "中" (3) + "😀" (4) = 10
    expect(countUtf8Bytes("aé中😀")).toBe(10);
  });
});
