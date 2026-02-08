"use client";

import { Construction } from "lucide-react";
import type { ExampleConfig } from "../data";

interface EditorPlaceholderProps {
  example: ExampleConfig;
}

export function EditorPlaceholder({ example }: EditorPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-xl">{example.title}</h2>
        <p className="max-w-md text-muted-foreground text-sm">
          {example.description}
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-muted-foreground text-sm">
        <Construction className="size-4" />
        <span>Editor implementation coming soon</span>
      </div>
    </div>
  );
}
