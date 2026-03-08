import { describe, it, expect } from "vitest";
import { filterSuggestionItems } from "../../suggestion-menu/filter";
import type { SuggestionItem } from "../../suggestion-menu/types";

const item = (overrides: Partial<SuggestionItem> = {}): SuggestionItem => ({
  title: "Heading",
  onSelect: () => {},
  ...overrides,
});

describe("filterSuggestionItems", () => {
  it("returns all items when query is empty", () => {
    const items = [item({ title: "A" }), item({ title: "B" })];
    expect(filterSuggestionItems(items, "")).toEqual(items);
  });

  it("matches against title (case-insensitive)", () => {
    const items = [item({ title: "Heading" }), item({ title: "Paragraph" })];
    expect(filterSuggestionItems(items, "head")).toEqual([items[0]]);
  });

  it("matches against subtext", () => {
    const items = [
      item({ title: "H1", subtext: "Large heading" }),
      item({ title: "H2", subtext: "Medium heading" }),
      item({ title: "P", subtext: "Body text" }),
    ];
    expect(filterSuggestionItems(items, "body")).toEqual([items[2]]);
  });

  it("matches against keywords", () => {
    const items = [
      item({ title: "Code Block", keywords: ["pre", "snippet"] }),
      item({ title: "Quote" }),
    ];
    expect(filterSuggestionItems(items, "snippet")).toEqual([items[0]]);
  });

  it("returns empty array when nothing matches", () => {
    const items = [item({ title: "Heading" }), item({ title: "Paragraph" })];
    expect(filterSuggestionItems(items, "zzz")).toEqual([]);
  });

  it("returns multiple matches", () => {
    const items = [
      item({ title: "Heading 1" }),
      item({ title: "Heading 2" }),
      item({ title: "Paragraph" }),
    ];
    expect(filterSuggestionItems(items, "heading")).toHaveLength(2);
  });

  it("handles items with no subtext or keywords", () => {
    const items = [item({ title: "Bold" })];
    expect(filterSuggestionItems(items, "bold")).toEqual(items);
    expect(filterSuggestionItems(items, "xyz")).toEqual([]);
  });
});
