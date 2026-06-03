"use client";

import { useEffect, useState } from "react";

export function useIsApple(): boolean {
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    setIsApple(
      typeof navigator !== "undefined" &&
        /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
    );
  }, []);

  return isApple;
}
