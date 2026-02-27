import { describe, expect, it } from "vitest";
import { sanitizeUrl, validateUrl } from "@typix-editor/core";

describe("sanitizeUrl", () => {
  it("returns the same url for supported protocols", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
    expect(sanitizeUrl("mailto:test@example.com")).toBe(
      "mailto:test@example.com"
    );
    expect(sanitizeUrl("tel:+123456789")).toBe("tel:+123456789");
    expect(sanitizeUrl("sms:+123456789")).toBe("sms:+123456789");
  });

  it("returns about:blank for unsupported protocols", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("about:blank");
    expect(
      sanitizeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==")
    ).toBe("about:blank");
    expect(sanitizeUrl("file:///etc/passwd")).toBe("about:blank");
  });

  it("returns the original value if URL constructor throws", () => {
    // URL() throws for relative or malformed URLs
    expect(sanitizeUrl("example.com")).toBe("example.com");
    expect(sanitizeUrl("not a url")).toBe("not a url");
    expect(sanitizeUrl("www.example.com")).toBe("www.example.com");
  });
});

describe("validateUrl", () => {
  it("returns true for valid urls", () => {
    expect(validateUrl("https://example.com")).toBe(true);
    expect(validateUrl("http://example.com/path?query=1")).toBe(true);
    expect(validateUrl("www.example.com")).toBe(true);
    expect(validateUrl("mailto:test@example.com")).toBe(true);
  });

  it("allows https:// as a special case", () => {
    expect(validateUrl("https://")).toBe(true);
  });

  it("returns false for invalid urls", () => {
    expect(validateUrl("")).toBe(false);
    expect(validateUrl("not a url")).toBe(false);
    expect(validateUrl("htp://example.com")).toBe(false);
    expect(validateUrl("://example.com")).toBe(false);
  });
});
