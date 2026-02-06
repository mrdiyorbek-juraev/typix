import { describe, expect, it } from "vitest";
import DICTIONARY from "../dictionary";
import { uuid } from "../lib";

describe("auto-complete", () => {
  describe("DICTIONARY", () => {
    it("exports an array of words", () => {
      expect(Array.isArray(DICTIONARY)).toBe(true);
      expect(DICTIONARY.length).toBeGreaterThan(0);
    });

    it("contains only strings", () => {
      for (const word of DICTIONARY) {
        expect(typeof word).toBe("string");
      }
    });

    it("contains only non-empty strings", () => {
      for (const word of DICTIONARY) {
        expect(word.length).toBeGreaterThan(0);
      }
    });

    it("has a significant number of words", () => {
      // The dictionary should have at least 2000 words based on the source
      expect(DICTIONARY.length).toBeGreaterThanOrEqual(2000);
    });

    it("contains common English words", () => {
      const commonWords = [
        "information",
        "available",
        "copyright",
        "university",
        "technology",
        "education",
        "development",
        "international",
      ];

      for (const word of commonWords) {
        expect(DICTIONARY).toContain(word);
      }
    });

    it("words are all lowercase", () => {
      for (const word of DICTIONARY) {
        expect(word).toBe(word.toLowerCase());
      }
    });

    it("words do not contain leading/trailing spaces", () => {
      for (const word of DICTIONARY) {
        expect(word).toBe(word.trim());
      }
    });

    it("has unique words (no duplicates)", () => {
      const uniqueWords = new Set(DICTIONARY);
      expect(uniqueWords.size).toBe(DICTIONARY.length);
    });

    describe("word categories", () => {
      it("includes technology terms", () => {
        const techTerms = [
          "technology",
          "software",
          "computer",
          "internet",
          "programming",
          "javascript",
          "microsoft",
        ];

        const foundTerms = techTerms.filter((term) =>
          DICTIONARY.includes(term)
        );
        expect(foundTerms.length).toBeGreaterThan(3);
      });

      it("includes location names", () => {
        const locations = [
          "california",
          "washington",
          "australia",
          "cambridge",
          "philadelphia",
        ];

        const foundLocations = locations.filter((loc) =>
          DICTIONARY.includes(loc)
        );
        expect(foundLocations.length).toBeGreaterThan(2);
      });

      it("includes business terms", () => {
        const businessTerms = [
          "management",
          "marketing",
          "financial",
          "corporate",
          "professional",
        ];

        const foundTerms = businessTerms.filter((term) =>
          DICTIONARY.includes(term)
        );
        expect(foundTerms.length).toBeGreaterThan(3);
      });
    });

    describe("word length distribution", () => {
      it("includes words of various lengths", () => {
        const wordsByLength = new Map<number, number>();

        for (const word of DICTIONARY) {
          const len = word.length;
          wordsByLength.set(len, (wordsByLength.get(len) || 0) + 1);
        }

        // Should have words with multiple different lengths
        // (the dictionary focuses on longer words based on the source)
        expect(wordsByLength.size).toBeGreaterThan(5);
      });

      it("has minimum word length of at least 7 characters", () => {
        // Based on the source URL, this dictionary uses "long" words
        const minLength = Math.min(...DICTIONARY.map((w) => w.length));
        expect(minLength).toBeGreaterThanOrEqual(7);
      });
    });
  });

  describe("uuid", () => {
    it("exports a string", () => {
      expect(typeof uuid).toBe("string");
    });


    it("contains only lowercase letters", () => {
      expect(uuid).toMatch(/^[a-z]+$/);
    });

    it("is consistent within a session", () => {
      // The uuid is generated once at module load time
      // Multiple accesses should return the same value
      const firstAccess = uuid;
      const secondAccess = uuid;
      expect(firstAccess).toBe(secondAccess);
    });
  });

  describe("autocomplete word matching", () => {
    // Test utility function for filtering words (simulating autocomplete behavior)
    function filterWords(prefix: string, words: string[]): string[] {
      const normalizedPrefix = prefix.toLowerCase();
      return words.filter((word) => word.startsWith(normalizedPrefix));
    }

    it("filters words by prefix", () => {
      const results = filterWords("info", DICTIONARY);

      expect(results.length).toBeGreaterThan(0);
      for (const result of results) {
        expect(result.startsWith("info")).toBe(true);
      }
    });

    it("returns empty array for no matches", () => {
      const results = filterWords("xyz123", DICTIONARY);
      expect(results).toHaveLength(0);
    });

    it("is case insensitive", () => {
      const lowerResults = filterWords("tech", DICTIONARY);
      const upperResults = filterWords("TECH", DICTIONARY);

      expect(lowerResults).toEqual(upperResults);
    });

    it("matches single character prefix", () => {
      const results = filterWords("a", DICTIONARY);

      expect(results.length).toBeGreaterThan(0);
      for (const result of results) {
        expect(result.startsWith("a")).toBe(true);
      }
    });

    describe("common prefix scenarios", () => {
      it("suggests 'information' for 'info' prefix", () => {
        const results = filterWords("info", DICTIONARY);
        expect(results).toContain("information");
      });

      it("suggests 'development' for 'dev' prefix", () => {
        const results = filterWords("dev", DICTIONARY);
        expect(results).toContain("development");
      });

      it("suggests 'technology' for 'tech' prefix", () => {
        const results = filterWords("tech", DICTIONARY);
        expect(results).toContain("technology");
      });

      it("suggests 'international' for 'inter' prefix", () => {
        const results = filterWords("inter", DICTIONARY);
        expect(results).toContain("international");
      });

      it("suggests 'management' for 'manage' prefix", () => {
        const results = filterWords("manage", DICTIONARY);
        expect(results).toContain("management");
      });
    });
  });
});
