import { useEffect, useState } from "react";

/** SSR-safe mount guard — returns false on server and first render, true after hydration. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
