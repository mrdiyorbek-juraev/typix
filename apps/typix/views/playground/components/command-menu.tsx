"use client";

import {
  type CommandMenuOption,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
} from "@typix-editor/react";
import { cn } from "@/lib/cn";

type CommandMenuProps = {
  commands: CommandMenuOption[];
};

export function CommandMenu({ commands }: CommandMenuProps) {
  return (
    <EditorCommand className="z-50" items={commands} trigger="/">
      <EditorCommandEmpty className="px-4 py-3 text-muted-foreground text-sm">
        No commands found
      </EditorCommandEmpty>
      <EditorCommandList className="max-h-[300px] overflow-y-auto">
        {commands.map((item) => (
          <EditorCommandItem
            key={item.title}
            keywords={item.keywords}
            onSelect={item.onSelect}
            value={item.title}
          >
            {({ isSelected }) => (
              <div
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2",
                  "transition-colors",
                  isSelected ? "bg-accent" : "hover:bg-accent/50"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{item.title}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {item.shortDescription}
                  </p>
                </div>
                {item.keyboardShortcut && (
                  <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    {item.keyboardShortcut}
                  </kbd>
                )}
              </div>
            )}
          </EditorCommandItem>
        ))}
      </EditorCommandList>
    </EditorCommand>
  );
}
