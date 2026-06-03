"use client";

import { FullEditor } from "./editor/index";
import { TypixLogo } from "./logo";

export function PlaygroundEditor() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <TypixLogo className="size-7 invert dark:invert-0" />
            <span className="font-semibold text-lg tracking-tight text-black dark:text-white">
              Typix
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          All features enabled
        </span>
      </header>
      <main className="flex-1 overflow-y-auto">
        <FullEditor />
      </main>
    </div>
  );
}
