import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addSwipeDownListener,
  addSwipeLeftListener,
  addSwipeRightListener,
  addSwipeUpListener,
} from "../../utils/swipe";

const createTouchEvent = (
  type: string,
  clientX: number,
  clientY: number
): TouchEvent => {
  return {
    type,
    changedTouches: [{ clientX, clientY }],
  } as unknown as TouchEvent;
};

const createEmptyTouchEvent = (type: string): TouchEvent => {
  return {
    type,
    changedTouches: [],
  } as unknown as TouchEvent;
};

describe("swipe utilities", () => {
  let element: HTMLElement;
  let touchStartHandler: ((e: TouchEvent) => void) | null;
  let touchEndHandler: ((e: TouchEvent) => void) | null;

  beforeEach(() => {
    touchStartHandler = null;
    touchEndHandler = null;

    element = {
      addEventListener: vi.fn(
        (event: string, handler: (e: TouchEvent) => void) => {
          if (event === "touchstart") {
            touchStartHandler = handler;
          } else if (event === "touchend") {
            touchEndHandler = handler;
          }
        }
      ),
      removeEventListener: vi.fn(),
    } as unknown as HTMLElement;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const simulateSwipe = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const touchStart = createTouchEvent("touchstart", startX, startY);
    const touchEnd = createTouchEvent("touchend", endX, endY);

    touchStartHandler?.(touchStart);
    touchEndHandler?.(touchEnd);

    return touchEnd;
  };

  describe("addSwipeLeftListener", () => {
    it("registers touch event listeners on element", () => {
      addSwipeLeftListener(element, vi.fn());

      expect(element.addEventListener).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function)
      );
      expect(element.addEventListener).toHaveBeenCalledWith(
        "touchend",
        expect.any(Function)
      );
    });

    it("calls callback for left swipe (negative x, |x| > |y|)", () => {
      const callback = vi.fn();
      addSwipeLeftListener(element, callback);

      const touchEnd = simulateSwipe(100, 100, 20, 100); // x: -80, y: 0

      expect(callback).toHaveBeenCalledWith(-80, touchEnd);
    });

    it("does not call callback for right swipe", () => {
      const callback = vi.fn();
      addSwipeLeftListener(element, callback);

      simulateSwipe(100, 100, 180, 100); // x: +80, y: 0

      expect(callback).not.toHaveBeenCalled();
    });

    it("does not call callback when vertical movement is greater", () => {
      const callback = vi.fn();
      addSwipeLeftListener(element, callback);

      simulateSwipe(100, 100, 80, 20); // x: -20, y: -80

      expect(callback).not.toHaveBeenCalled();
    });

    it("returns unsubscribe function that removes listener", () => {
      const callback = vi.fn();
      const unsubscribe = addSwipeLeftListener(element, callback);

      unsubscribe();

      expect(element.removeEventListener).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function)
      );
      expect(element.removeEventListener).toHaveBeenCalledWith(
        "touchend",
        expect.any(Function)
      );
    });
  });

  describe("addSwipeRightListener", () => {
    it("calls callback for right swipe (positive x, x > |y|)", () => {
      const callback = vi.fn();
      addSwipeRightListener(element, callback);

      const touchEnd = simulateSwipe(100, 100, 180, 100); // x: +80, y: 0

      expect(callback).toHaveBeenCalledWith(80, touchEnd);
    });

    it("does not call callback for left swipe", () => {
      const callback = vi.fn();
      addSwipeRightListener(element, callback);

      simulateSwipe(100, 100, 20, 100); // x: -80, y: 0

      expect(callback).not.toHaveBeenCalled();
    });

    it("does not call callback when vertical movement is greater", () => {
      const callback = vi.fn();
      addSwipeRightListener(element, callback);

      simulateSwipe(100, 100, 120, 20); // x: +20, y: -80

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("addSwipeUpListener", () => {
    it("calls callback for up swipe (negative y, |y| > |x|)", () => {
      const callback = vi.fn();
      addSwipeUpListener(element, callback);

      const touchEnd = simulateSwipe(100, 100, 100, 20); // x: 0, y: -80

      expect(callback).toHaveBeenCalledWith(0, touchEnd);
    });

    it("does not call callback for down swipe", () => {
      const callback = vi.fn();
      addSwipeUpListener(element, callback);

      simulateSwipe(100, 100, 100, 180); // x: 0, y: +80

      expect(callback).not.toHaveBeenCalled();
    });

    it("does not call callback when horizontal movement is greater", () => {
      const callback = vi.fn();
      addSwipeUpListener(element, callback);

      simulateSwipe(100, 100, 20, 80); // x: -80, y: -20

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("addSwipeDownListener", () => {
    it("calls callback for down swipe (positive y, y > |x|)", () => {
      const callback = vi.fn();
      addSwipeDownListener(element, callback);

      const touchEnd = simulateSwipe(100, 100, 100, 180); // x: 0, y: +80

      expect(callback).toHaveBeenCalledWith(0, touchEnd);
    });

    it("does not call callback for up swipe", () => {
      const callback = vi.fn();
      addSwipeDownListener(element, callback);

      simulateSwipe(100, 100, 100, 20); // x: 0, y: -80

      expect(callback).not.toHaveBeenCalled();
    });

    it("does not call callback when horizontal movement is greater", () => {
      const callback = vi.fn();
      addSwipeDownListener(element, callback);

      simulateSwipe(100, 100, 20, 120); // x: -80, y: +20

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("multiple listeners", () => {
    it("supports multiple listeners on same element", () => {
      const leftCallback = vi.fn();
      const rightCallback = vi.fn();

      addSwipeLeftListener(element, leftCallback);
      addSwipeRightListener(element, rightCallback);

      // Left swipe
      simulateSwipe(100, 100, 20, 100);

      expect(leftCallback).toHaveBeenCalled();
      expect(rightCallback).not.toHaveBeenCalled();
    });

    it("only removes event listeners when all listeners are removed", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = addSwipeLeftListener(element, callback1);
      addSwipeLeftListener(element, callback2);

      unsubscribe1();

      // Event listeners should not be removed yet
      expect(element.removeEventListener).not.toHaveBeenCalled();
    });

    it("removes event listeners when last listener is removed", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = addSwipeLeftListener(element, callback1);
      const unsubscribe2 = addSwipeLeftListener(element, callback2);

      unsubscribe1();
      unsubscribe2();

      expect(element.removeEventListener).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function)
      );
      expect(element.removeEventListener).toHaveBeenCalledWith(
        "touchend",
        expect.any(Function)
      );
    });
  });

  describe("edge cases", () => {
    it("handles empty touch event on touchstart", () => {
      const callback = vi.fn();
      addSwipeLeftListener(element, callback);

      const emptyTouchStart = createEmptyTouchEvent("touchstart");
      const touchEnd = createTouchEvent("touchend", 20, 100);

      touchStartHandler?.(emptyTouchStart);
      touchEndHandler?.(touchEnd);

      expect(callback).not.toHaveBeenCalled();
    });

    it("handles empty touch event on touchend", () => {
      const callback = vi.fn();
      addSwipeLeftListener(element, callback);

      const touchStart = createTouchEvent("touchstart", 100, 100);
      const emptyTouchEnd = createEmptyTouchEvent("touchend");

      touchStartHandler?.(touchStart);
      touchEndHandler?.(emptyTouchEnd);

      expect(callback).not.toHaveBeenCalled();
    });

    it("handles diagonal swipe with equal x and y (not triggered)", () => {
      const leftCallback = vi.fn();
      const upCallback = vi.fn();

      addSwipeLeftListener(element, leftCallback);
      addSwipeUpListener(element, upCallback);

      simulateSwipe(100, 100, 50, 50); // x: -50, y: -50 (equal)

      // Neither should trigger since |x| is not > |y| and vice versa
      expect(leftCallback).not.toHaveBeenCalled();
      expect(upCallback).not.toHaveBeenCalled();
    });

    it("handles zero movement", () => {
      const callback = vi.fn();
      addSwipeLeftListener(element, callback);

      simulateSwipe(100, 100, 100, 100); // x: 0, y: 0

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
