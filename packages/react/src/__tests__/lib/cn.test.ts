import { describe, it, expect } from "vitest";
import { cn } from "../../lib/cn";

describe("cn", () => {
  it("merges simple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes via clsx", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });

  it("handles undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("handles array input", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("handles object input", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });
});
