import { describe, it, expect } from "vitest";
import { buildSuggestionTriggerFn } from "../../suggestion-menu/trigger-match";

const defaults = {
  char: "/",
  allowSpaces: false,
  allowToIncludeChar: false,
  allowedPrefixes: null,
  startOfLine: false,
  minLength: 0,
  maxLength: 50,
};

describe("buildSuggestionTriggerFn", () => {
  it("returns a function", () => {
    const fn = buildSuggestionTriggerFn(defaults);
    expect(typeof fn).toBe("function");
  });

  it("matches trigger at end of text", () => {
    const fn = buildSuggestionTriggerFn(defaults);
    const result = fn("/", null as never);
    expect(result).not.toBeNull();
    expect(result!.leadOffset).toBe(0);
    expect(result!.matchingString).toBe("");
    expect(result!.replaceableString).toBe("/");
  });

  it("matches trigger with query text", () => {
    const fn = buildSuggestionTriggerFn(defaults);
    const result = fn("hello /head", null as never);
    expect(result).not.toBeNull();
    expect(result!.matchingString).toBe("head");
    expect(result!.replaceableString).toBe("/head");
  });

  it("returns null when no trigger present", () => {
    const fn = buildSuggestionTriggerFn(defaults);
    expect(fn("hello world", null as never)).toBeNull();
  });

  it("respects minLength", () => {
    const fn = buildSuggestionTriggerFn({ ...defaults, minLength: 3 });
    expect(fn("/ab", null as never)).toBeNull();
    expect(fn("/abc", null as never)).not.toBeNull();
  });

  it("respects maxLength", () => {
    const fn = buildSuggestionTriggerFn({ ...defaults, maxLength: 3 });
    expect(fn("/abc", null as never)).not.toBeNull();
    expect(fn("/abcd", null as never)).toBeNull();
  });

  it("does not match spaces by default", () => {
    const fn = buildSuggestionTriggerFn(defaults);
    // After a space, a new match context begins — the query stops before the space
    const result = fn("/hello world", null as never);
    // The regex won't match because spaces break the token
    expect(result).toBeNull();
  });

  it("matches spaces when allowSpaces is true", () => {
    const fn = buildSuggestionTriggerFn({ ...defaults, allowSpaces: true });
    const result = fn("/hello world", null as never);
    expect(result).not.toBeNull();
    expect(result!.matchingString).toBe("hello world");
  });

  it("includes trigger char when allowToIncludeChar is true", () => {
    const fn = buildSuggestionTriggerFn({
      ...defaults,
      allowToIncludeChar: true,
    });
    const result = fn("/head", null as never);
    expect(result).not.toBeNull();
    expect(result!.matchingString).toBe("/head");
  });

  it("works with @ trigger", () => {
    const fn = buildSuggestionTriggerFn({ ...defaults, char: "@" });
    const result = fn("hello @john", null as never);
    expect(result).not.toBeNull();
    expect(result!.matchingString).toBe("john");
  });

  it("works with # trigger", () => {
    const fn = buildSuggestionTriggerFn({ ...defaults, char: "#" });
    const result = fn("#tag", null as never);
    expect(result).not.toBeNull();
    expect(result!.matchingString).toBe("tag");
  });

  it("requires start of line when startOfLine is true", () => {
    const fn = buildSuggestionTriggerFn({ ...defaults, startOfLine: true });
    expect(fn("/head", null as never)).not.toBeNull();
    expect(fn("text /head", null as never)).toBeNull();
  });

  it("respects allowedPrefixes", () => {
    const fn = buildSuggestionTriggerFn({
      ...defaults,
      allowedPrefixes: [" ", "("],
    });
    expect(fn("text /cmd", null as never)).not.toBeNull();
    expect(fn("(/cmd", null as never)).not.toBeNull();
    // At start of line should also work (^ in regex)
    expect(fn("/cmd", null as never)).not.toBeNull();
  });
});
