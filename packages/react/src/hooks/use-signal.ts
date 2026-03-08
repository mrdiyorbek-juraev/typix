"use client";

import { useEffect, useState } from "react";
import type { Signal } from "@lexical/extension";

/**
 * Subscribes to a Lexical extension `Signal<T>` and returns its current value,
 * triggering a React re-render whenever the signal changes.
 */
export function useSignal<T>(sig: Signal<T>): T {
  const [value, setValue] = useState<T>(() => sig.value);

  useEffect(() => {
    // Read initial value in case it changed between render and effect
    setValue(sig.value);

    const unsubscribe = sig.subscribe((next) => {
      setValue(next);
    });

    return unsubscribe;
  }, [sig]);

  return value;
}
