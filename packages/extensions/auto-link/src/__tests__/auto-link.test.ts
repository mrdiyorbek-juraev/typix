import { describe, expect, it } from "vitest";
import { URL_REGEX, EMAIL_REGEX } from "../lib";

describe("auto-link regex patterns", () => {
  describe("URL_REGEX", () => {
    describe("valid URLs", () => {
      it("matches https URLs", () => {
        expect(URL_REGEX.test("https://example.com")).toBe(true);
        expect(URL_REGEX.test("https://www.example.com")).toBe(true);
      });

      it("matches http URLs", () => {
        expect(URL_REGEX.test("http://example.com")).toBe(true);
        expect(URL_REGEX.test("http://www.example.com")).toBe(true);
      });

      it("matches www URLs without protocol", () => {
        expect(URL_REGEX.test("www.example.com")).toBe(true);
        expect(URL_REGEX.test("www.example.org")).toBe(true);
      });

      it("matches URLs with paths", () => {
        expect(URL_REGEX.test("https://example.com/path/to/page")).toBe(true);
        expect(URL_REGEX.test("https://example.com/path")).toBe(true);
      });

      it("matches URLs with query strings", () => {
        expect(URL_REGEX.test("https://example.com?query=value")).toBe(true);
        expect(URL_REGEX.test("https://example.com/path?a=1&b=2")).toBe(true);
      });

      it("matches URLs with fragments", () => {
        expect(URL_REGEX.test("https://example.com#section")).toBe(true);
        expect(URL_REGEX.test("https://example.com/page#anchor")).toBe(true);
      });

      it("matches URLs with ports", () => {
        expect(URL_REGEX.test("https://example.com:8080")).toBe(true);
        // localhost without TLD doesn't match - requires valid domain with TLD
        expect(URL_REGEX.test("http://localhost:3000")).toBe(false);
        expect(URL_REGEX.test("http://localhost.dev:3000")).toBe(true);
      });

      it("matches URLs with subdomains", () => {
        expect(URL_REGEX.test("https://api.example.com")).toBe(true);
        expect(URL_REGEX.test("https://blog.test.example.com")).toBe(true);
      });

      it("matches URLs with various TLDs", () => {
        expect(URL_REGEX.test("https://example.io")).toBe(true);
        expect(URL_REGEX.test("https://example.co.uk")).toBe(true);
        expect(URL_REGEX.test("https://example.dev")).toBe(true);
      });
    });

    describe("invalid URLs", () => {
      it("does not match plain text", () => {
        expect(URL_REGEX.test("hello world")).toBe(false);
        expect(URL_REGEX.test("not a url")).toBe(false);
      });

      it("does not match incomplete URLs", () => {
        expect(URL_REGEX.test("example")).toBe(false);
        expect(URL_REGEX.test("https://")).toBe(false);
      });

      it("does not match URLs without TLD", () => {
        expect(URL_REGEX.test("https://localhost")).toBe(false);
      });
    });

    describe("URL extraction from text", () => {
      it("extracts URL from sentence", () => {
        const text = "Check out https://example.com for more info";
        const match = text.match(URL_REGEX);
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("https://example.com");
      });

      it("extracts URL at beginning of text", () => {
        const text = "https://example.com is a great site";
        const match = text.match(URL_REGEX);
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("https://example.com");
      });

      it("extracts URL at end of text", () => {
        const text = "Visit us at https://example.com";
        const match = text.match(URL_REGEX);
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("https://example.com");
      });
    });
  });

  describe("EMAIL_REGEX", () => {
    describe("valid emails", () => {
      it("matches simple emails", () => {
        expect(EMAIL_REGEX.test("test@example.com")).toBe(true);
        expect(EMAIL_REGEX.test("user@domain.org")).toBe(true);
      });

      it("matches emails with dots in local part", () => {
        expect(EMAIL_REGEX.test("first.last@example.com")).toBe(true);
        expect(EMAIL_REGEX.test("user.name.here@domain.com")).toBe(true);
      });

      it("matches emails with plus signs", () => {
        expect(EMAIL_REGEX.test("user+tag@example.com")).toBe(true);
      });

      it("matches emails with numbers", () => {
        expect(EMAIL_REGEX.test("user123@example.com")).toBe(true);
        expect(EMAIL_REGEX.test("test@domain123.com")).toBe(true);
      });

      it("matches emails with subdomains", () => {
        expect(EMAIL_REGEX.test("user@mail.example.com")).toBe(true);
        expect(EMAIL_REGEX.test("user@sub.domain.example.org")).toBe(true);
      });

      it("matches emails with various TLDs", () => {
        expect(EMAIL_REGEX.test("user@example.io")).toBe(true);
        expect(EMAIL_REGEX.test("user@example.co.uk")).toBe(true);
        expect(EMAIL_REGEX.test("user@example.museum")).toBe(true);
      });

      it("matches emails with hyphens in domain", () => {
        expect(EMAIL_REGEX.test("user@my-domain.com")).toBe(true);
      });

      it("matches emails with underscores", () => {
        expect(EMAIL_REGEX.test("user_name@example.com")).toBe(true);
      });
    });

    describe("invalid emails", () => {
      it("does not match emails without @", () => {
        expect(EMAIL_REGEX.test("userexample.com")).toBe(false);
      });

      it("does not match emails without domain", () => {
        expect(EMAIL_REGEX.test("user@")).toBe(false);
      });

      it("does not match emails without local part", () => {
        expect(EMAIL_REGEX.test("@example.com")).toBe(false);
      });

      it("does not match plain text", () => {
        expect(EMAIL_REGEX.test("hello world")).toBe(false);
        expect(EMAIL_REGEX.test("not an email")).toBe(false);
      });
    });

    describe("email extraction from text", () => {
      it("extracts email from sentence", () => {
        const text = "Contact us at support@example.com for help";
        const match = text.match(EMAIL_REGEX);
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("support@example.com");
      });

      it("extracts email at beginning of text", () => {
        const text = "user@example.com is my email";
        const match = text.match(EMAIL_REGEX);
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("user@example.com");
      });

      it("extracts email at end of text", () => {
        const text = "Send mail to user@example.com";
        const match = text.match(EMAIL_REGEX);
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("user@example.com");
      });
    });
  });
});
