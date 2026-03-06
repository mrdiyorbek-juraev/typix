import { useCallback, useRef, useState } from "react";

/**
 * Hook for managing controlled/uncontrolled state.
 * If `prop` is defined, the component is controlled.
 * Otherwise, internal state is used with `defaultProp` as initial value.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
}): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void] {
  const [internal, setInternal] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : internal;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T | undefined) => T)) => {
      if (isControlled) {
        const nextValue =
          typeof next === "function"
            ? (next as (prev: T | undefined) => T)(prop)
            : next;
        onChangeRef.current?.(nextValue);
      } else {
        setInternal((prev) => {
          const nextValue =
            typeof next === "function"
              ? (next as (prev: T | undefined) => T)(prev)
              : next;
          onChangeRef.current?.(nextValue);
          return nextValue;
        });
      }
    },
    [isControlled, prop]
  );

  return [value, setValue];
}
