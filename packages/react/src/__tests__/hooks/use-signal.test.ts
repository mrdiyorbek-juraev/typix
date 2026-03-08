import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { signal } from "@lexical/extension";
import { useSignal } from "../../hooks/use-signal";

describe("useSignal", () => {
  it("returns the initial signal value", () => {
    const sig = signal(42);
    const { result } = renderHook(() => useSignal(sig));
    expect(result.current).toBe(42);
  });

  it("re-renders when the signal value changes", () => {
    const sig = signal("hello");
    const { result } = renderHook(() => useSignal(sig));

    expect(result.current).toBe("hello");

    act(() => {
      sig.value = "world";
    });

    expect(result.current).toBe("world");
  });

  it("handles multiple updates", () => {
    const sig = signal(0);
    const { result } = renderHook(() => useSignal(sig));

    act(() => {
      sig.value = 1;
    });
    expect(result.current).toBe(1);

    act(() => {
      sig.value = 2;
    });
    expect(result.current).toBe(2);
  });

  it("unsubscribes on unmount", () => {
    const sig = signal("a");
    const { result, unmount } = renderHook(() => useSignal(sig));

    expect(result.current).toBe("a");
    unmount();

    // After unmount, changing the signal should not throw or cause issues
    sig.value = "b";
    // result.current still holds the last value before unmount
    expect(result.current).toBe("a");
  });

  it("re-subscribes when signal reference changes", () => {
    const sig1 = signal("first");
    const sig2 = signal("second");

    const { result, rerender } = renderHook(
      ({ sig }) => useSignal(sig),
      { initialProps: { sig: sig1 } },
    );

    expect(result.current).toBe("first");

    rerender({ sig: sig2 });
    expect(result.current).toBe("second");

    // Old signal should no longer trigger updates
    act(() => {
      sig1.value = "stale";
    });
    expect(result.current).toBe("second");

    // New signal should trigger updates
    act(() => {
      sig2.value = "updated";
    });
    expect(result.current).toBe("updated");
  });

  it("works with null values", () => {
    const sig = signal<string | null>(null);
    const { result } = renderHook(() => useSignal(sig));
    expect(result.current).toBeNull();

    act(() => {
      sig.value = "now set";
    });
    expect(result.current).toBe("now set");
  });
});
