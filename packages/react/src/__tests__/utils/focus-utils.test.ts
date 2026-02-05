import { describe, expect, it, vi } from "vitest";
import {
  findFirstFocusableDescendant,
  focusNearestDescendant,
  isKeyboardInput,
} from "../../utils";

describe("findFirstFocusableDescendant", () => {
  it("returns a button element", () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    container.appendChild(button);

    expect(findFirstFocusableDescendant(container)).toBe(button);
  });

  it("returns an anchor with href", () => {
    const container = document.createElement("div");
    const anchor = document.createElement("a");
    anchor.href = "https://example.com";
    container.appendChild(anchor);

    expect(findFirstFocusableDescendant(container)).toBe(anchor);
  });

  it("returns an input element", () => {
    const container = document.createElement("div");
    const input = document.createElement("input");
    container.appendChild(input);

    expect(findFirstFocusableDescendant(container)).toBe(input);
  });

  it("returns a select element", () => {
    const container = document.createElement("div");
    const select = document.createElement("select");
    container.appendChild(select);

    expect(findFirstFocusableDescendant(container)).toBe(select);
  });

  it("returns a textarea element", () => {
    const container = document.createElement("div");
    const textarea = document.createElement("textarea");
    container.appendChild(textarea);

    expect(findFirstFocusableDescendant(container)).toBe(textarea);
  });

  it("returns a contenteditable element", () => {
    const container = document.createElement("div");
    const editable = document.createElement("div");
    editable.contentEditable = "true";
    container.appendChild(editable);

    expect(findFirstFocusableDescendant(container)).toBe(editable);
  });

  it("returns the first focusable when multiple exist", () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    const input = document.createElement("input");
    container.appendChild(button);
    container.appendChild(input);

    expect(findFirstFocusableDescendant(container)).toBe(button);
  });

  it("finds nested focusable elements", () => {
    const container = document.createElement("div");
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    wrapper.appendChild(button);
    container.appendChild(wrapper);

    expect(findFirstFocusableDescendant(container)).toBe(button);
  });

  it("returns null when no focusable elements exist", () => {
    const container = document.createElement("div");
    const span = document.createElement("span");
    container.appendChild(span);

    expect(findFirstFocusableDescendant(container)).toBeNull();
  });

  it("returns null for empty container", () => {
    const container = document.createElement("div");

    expect(findFirstFocusableDescendant(container)).toBeNull();
  });

  it("does not return anchor without href", () => {
    const container = document.createElement("div");
    const anchor = document.createElement("a");
    container.appendChild(anchor);

    expect(findFirstFocusableDescendant(container)).toBeNull();
  });
});

describe("focusNearestDescendant", () => {
  it("focuses the first focusable element and returns it", () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    container.appendChild(button);
    document.body.appendChild(container);

    const focusSpy = vi.spyOn(button, "focus");
    const result = focusNearestDescendant(container);

    expect(result).toBe(button);
    expect(focusSpy).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("returns null and does not throw when no focusable elements", () => {
    const container = document.createElement("div");

    const result = focusNearestDescendant(container);

    expect(result).toBeNull();
  });
});

describe("isKeyboardInput", () => {
  it("returns true for keyboard-triggered pointer event", () => {
    const event = {
      pointerId: -1,
      pointerType: "",
    } as PointerEvent;

    expect(isKeyboardInput(event)).toBe(true);
  });

  it("returns false for mouse pointer event", () => {
    const event = {
      pointerId: 1,
      pointerType: "mouse",
    } as PointerEvent;

    expect(isKeyboardInput(event)).toBe(false);
  });

  it("returns false for touch pointer event", () => {
    const event = {
      pointerId: 1,
      pointerType: "touch",
    } as PointerEvent;

    expect(isKeyboardInput(event)).toBe(false);
  });

  it("returns false for pen pointer event", () => {
    const event = {
      pointerId: 1,
      pointerType: "pen",
    } as PointerEvent;

    expect(isKeyboardInput(event)).toBe(false);
  });

  it("returns true for mouse event with detail 0 (keyboard)", () => {
    const event = {
      detail: 0,
    } as MouseEvent;

    expect(isKeyboardInput(event)).toBe(true);
  });

  it("returns false for mouse event with detail > 0 (click)", () => {
    const event = {
      detail: 1,
    } as MouseEvent;

    expect(isKeyboardInput(event)).toBe(false);
  });

  it("returns false for double-click mouse event", () => {
    const event = {
      detail: 2,
    } as MouseEvent;

    expect(isKeyboardInput(event)).toBe(false);
  });
});
