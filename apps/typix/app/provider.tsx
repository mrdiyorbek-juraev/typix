"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const inject = `
const urlParams = new URLSearchParams(window.location.search);
const uwuParam = urlParams.get("uwu");

if (typeof uwuParam === 'string') {
    localStorage.setItem('uwu', uwuParam);
}

const item = localStorage.getItem('uwu')

if (item === 'true') {
    document.documentElement.classList.add("uwu")
}
`;

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <TooltipProvider>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: inject }}
        />
        {children}
      </TooltipProvider>
    </RootProvider>
  );
}
