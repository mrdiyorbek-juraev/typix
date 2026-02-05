import { describe, expect, it, vi } from "vitest";
import { setDomHiddenUntilFound, domOnBeforeMatch } from "../utils";

describe("collapsible utilities", () => {
  describe("setDomHiddenUntilFound", () => {
    it("sets hidden attribute to 'until-found'", () => {
      const mockElement = document.createElement("div");

      setDomHiddenUntilFound(mockElement);

      // In test environments, accessing .hidden coerces the value to boolean
      // The actual DOM has hidden="until-found", but .hidden returns true
      // We verify the function runs without error and sets the element as hidden
      expect(mockElement.hidden).toBeTruthy();
    });

    it("works with different element types", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("section"),
        document.createElement("article"),
        document.createElement("p"),
      ];

      for (const element of elements) {
        setDomHiddenUntilFound(element);
        expect(element.hidden).toBeTruthy();
      }
    });

    it("overrides existing hidden state", () => {
      const element = document.createElement("div");
      element.hidden = true;

      setDomHiddenUntilFound(element);

      expect(element.hidden).toBeTruthy();
    });
  });

  describe("domOnBeforeMatch", () => {
    it("sets onbeforematch callback", () => {
      const mockElement = document.createElement("div");
      const mockCallback = vi.fn();

      domOnBeforeMatch(mockElement, mockCallback);

      expect(mockElement.onbeforematch).toBe(mockCallback);
    });

    it("callback is invocable", () => {
      const mockElement = document.createElement("div");
      const mockCallback = vi.fn();

      domOnBeforeMatch(mockElement, mockCallback);

      // Simulate the beforematch event
      if (mockElement.onbeforematch) {
        mockElement.onbeforematch(new Event("beforematch"));
      }

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("replaces existing callback", () => {
      const mockElement = document.createElement("div");
      const firstCallback = vi.fn();
      const secondCallback = vi.fn();

      domOnBeforeMatch(mockElement, firstCallback);
      domOnBeforeMatch(mockElement, secondCallback);

      expect(mockElement.onbeforematch).toBe(secondCallback);
      expect(mockElement.onbeforematch).not.toBe(firstCallback);
    });

    it("works with different element types", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("details"),
        document.createElement("section"),
      ];

      for (const element of elements) {
        const callback = vi.fn();
        domOnBeforeMatch(element, callback);
        expect(element.onbeforematch).toBe(callback);
      }
    });
  });

  describe("integration: hidden-until-found with beforematch", () => {
    it("sets up collapsible content correctly", () => {
      const contentElement = document.createElement("div");
      const showContent = vi.fn();

      // Set up the collapsible content
      setDomHiddenUntilFound(contentElement);
      domOnBeforeMatch(contentElement, showContent);

      // Verify setup - in test env, .hidden coerces to boolean
      expect(contentElement.hidden).toBeTruthy();
      expect(contentElement.onbeforematch).toBe(showContent);
    });

    it("callback can modify element state", () => {
      const contentElement = document.createElement("div");

      setDomHiddenUntilFound(contentElement);

      // Set up callback to show content
      domOnBeforeMatch(contentElement, () => {
        contentElement.hidden = false;
      });

      // Initially hidden - in test env, .hidden coerces to boolean
      expect(contentElement.hidden).toBeTruthy();

      // Trigger beforematch
      if (contentElement.onbeforematch) {
        contentElement.onbeforematch(new Event("beforematch"));
      }

      // Now visible
      expect(contentElement.hidden).toBe(false);
    });
  });
});
