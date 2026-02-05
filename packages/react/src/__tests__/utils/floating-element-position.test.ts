import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setFloatingElemPosition } from "../../utils/floating-element-position";

const createMockRect = (
  top: number,
  left: number,
  width: number,
  height: number
): DOMRect => ({
  top,
  left,
  right: left + width,
  bottom: top + height,
  width,
  height,
  x: left,
  y: top,
  toJSON: () => ({}),
});

const createMockElement = (rect: DOMRect): HTMLElement => {
  const style: Record<string, string> = {};
  return {
    getBoundingClientRect: () => rect,
    style,
  } as unknown as HTMLElement;
};

describe("setFloatingElemPosition", () => {
  let floatingElem: HTMLElement;
  let floatingStyle: Record<string, string>;

  beforeEach(() => {
    floatingStyle = {};
    floatingElem = {
      getBoundingClientRect: () => createMockRect(0, 0, 200, 40),
      style: floatingStyle,
    } as unknown as HTMLElement;

    // Mock window.getSelection to return null by default
    vi.spyOn(window, "getSelection").mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when targetRect is null", () => {
    it("hides the floating element", () => {
      const anchorElem = createMockElement(createMockRect(0, 0, 800, 600));
      const scrollerElem = createMockElement(createMockRect(0, 0, 800, 600));
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(null, floatingElem, anchorElem);

      expect(floatingStyle.opacity).toBe("0");
      expect(floatingStyle.transform).toBe("translate(-10000px, -10000px)");
    });
  });

  describe("when anchorElem is null", () => {
    it("hides the floating element", () => {
      const targetRect = createMockRect(100, 100, 50, 20);

      setFloatingElemPosition(targetRect, floatingElem, null);

      expect(floatingStyle.opacity).toBe("0");
      expect(floatingStyle.transform).toBe("translate(-10000px, -10000px)");
    });
  });

  describe("when anchorElem has no parentElement", () => {
    it("hides the floating element", () => {
      const targetRect = createMockRect(100, 100, 50, 20);
      const anchorElem = createMockElement(createMockRect(0, 0, 800, 600));
      Object.defineProperty(anchorElem, "parentElement", { value: null });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      expect(floatingStyle.opacity).toBe("0");
      expect(floatingStyle.transform).toBe("translate(-10000px, -10000px)");
    });
  });

  describe("basic positioning", () => {
    it("positions floating element above target with default gap", () => {
      const targetRect = createMockRect(200, 100, 50, 20);
      const anchorRect = createMockRect(50, 50, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      expect(floatingStyle.opacity).toBe("1");
      // top = targetRect.top(200) - floatingElemRect.height(40) - verticalGap(10) - anchorRect.top(50) = 100
      // left = targetRect.left(100) - horizontalOffset(5) - anchorRect.left(50) = 45
      expect(floatingStyle.transform).toBe("translate(45px, 100px)");
    });

    it("uses custom verticalGap", () => {
      const targetRect = createMockRect(200, 100, 50, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem, false, 20);

      // top = 200 - 40 - 20 - 0 = 140
      // left = 100 - 5 - 0 = 95
      expect(floatingStyle.transform).toBe("translate(95px, 140px)");
    });

    it("uses custom horizontalOffset", () => {
      const targetRect = createMockRect(200, 100, 50, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem, false, 10, 15);

      // top = 200 - 40 - 10 - 0 = 150
      // left = 100 - 15 - 0 = 85
      expect(floatingStyle.transform).toBe("translate(85px, 150px)");
    });
  });

  describe("vertical positioning adjustments", () => {
    it("flips below target when not enough space above", () => {
      const targetRect = createMockRect(30, 100, 50, 20); // Near top
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      // Initial: top = 30 - 40 - 10 = -20 (less than scrollerRect.top 0)
      // Adjusted: -20 + 40 + 20 + 10*2 = 60
      expect(floatingStyle.transform).toBe("translate(95px, 60px)");
    });

    it("uses larger gap for links when flipping below", () => {
      const targetRect = createMockRect(30, 100, 50, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem, true); // isLink = true

      // Initial: top = 30 - 40 - 10 = -20
      // Adjusted with link: -20 + 40 + 20 + 10*9 = 130
      expect(floatingStyle.transform).toBe("translate(95px, 130px)");
    });
  });

  describe("horizontal positioning adjustments", () => {
    it("adjusts left when floating element would overflow right edge", () => {
      const targetRect = createMockRect(200, 750, 50, 20); // Near right edge
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 800, 700); // 800px wide

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      // Initial left = 750 - 5 = 745
      // 745 + 200 = 945 > 800 (scrollerRect.right)
      // Adjusted: 800 - 200 - 5 = 595
      expect(floatingStyle.transform).toBe("translate(595px, 150px)");
    });

    it("adjusts left when floating element would be before left edge", () => {
      const targetRect = createMockRect(200, 2, 50, 20); // Very close to left edge
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 800, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      // Initial left = 2 - 5 = -3 (less than scrollerRect.left 0)
      // Adjusted: 0 + 5 = 5
      expect(floatingStyle.transform).toBe("translate(5px, 150px)");
    });
  });

  describe("text alignment handling", () => {
    const mockSelection = (textAlign: string, nodeType: number = Node.TEXT_NODE) => {
      const parentElement = document.createElement("div");
      const mockRange = {
        startContainer:
          nodeType === Node.ELEMENT_NODE
            ? parentElement
            : { nodeType, parentElement },
      };

      vi.spyOn(window, "getSelection").mockReturnValue({
        rangeCount: 1,
        getRangeAt: () => mockRange,
      } as unknown as Selection);

      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        textAlign,
      } as CSSStyleDeclaration);
    };

    it("positions from right for right-aligned text", () => {
      mockSelection("right");

      const targetRect = createMockRect(200, 100, 300, 20); // right = 400
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      // For right-aligned: left = targetRect.right(400) - floatingElemRect.width(200) + horizontalOffset(5) = 205
      expect(floatingStyle.transform).toBe("translate(205px, 150px)");
    });

    it("positions from right for end-aligned text", () => {
      mockSelection("end");

      const targetRect = createMockRect(200, 100, 300, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      expect(floatingStyle.transform).toBe("translate(205px, 150px)");
    });

    it("uses default positioning for left-aligned text", () => {
      mockSelection("left");

      const targetRect = createMockRect(200, 100, 50, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      // left = 100 - 5 = 95 (default positioning)
      expect(floatingStyle.transform).toBe("translate(95px, 150px)");
    });

    it("handles element node type directly", () => {
      mockSelection("right", Node.ELEMENT_NODE);

      const targetRect = createMockRect(200, 100, 300, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      expect(floatingStyle.transform).toBe("translate(205px, 150px)");
    });

    it("handles no selection gracefully", () => {
      vi.spyOn(window, "getSelection").mockReturnValue(null);

      const targetRect = createMockRect(200, 100, 50, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      expect(floatingStyle.opacity).toBe("1");
      expect(floatingStyle.transform).toBe("translate(95px, 150px)");
    });

    it("handles selection with no ranges", () => {
      vi.spyOn(window, "getSelection").mockReturnValue({
        rangeCount: 0,
      } as unknown as Selection);

      const targetRect = createMockRect(200, 100, 50, 20);
      const anchorRect = createMockRect(0, 0, 800, 600);
      const scrollerRect = createMockRect(0, 0, 900, 700);

      const anchorElem = createMockElement(anchorRect);
      const scrollerElem = createMockElement(scrollerRect);
      Object.defineProperty(anchorElem, "parentElement", { value: scrollerElem });

      setFloatingElemPosition(targetRect, floatingElem, anchorElem);

      expect(floatingStyle.transform).toBe("translate(95px, 150px)");
    });
  });
});
