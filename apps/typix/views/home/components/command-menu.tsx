"use client";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  type CommandMenuOption,
} from "@typix-editor/react";
import { cn } from "@/lib/cn";

type CommandMenuProps = {
  commands: CommandMenuOption[];
};

export function CommandMenu({ commands }: CommandMenuProps) {
  return (
    <EditorCommand
      items={commands}
      trigger="/"
      className="z-50"
    >
      <EditorCommandEmpty className="px-4 py-3 text-sm text-muted-foreground">
        No commands found
      </EditorCommandEmpty>
      <EditorCommandList className="max-h-[300px] overflow-y-auto">
        {commands.map((item) => (
          <EditorCommandItem
            key={item.title}
            value={item.title}
            keywords={item.keywords}
            onSelect={item.onSelect}
          >
            {({ isSelected }) => (
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
                  "transition-colors",
                  isSelected ? "bg-accent" : "hover:bg-accent/50"
                )}
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-md border bg-background">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.shortDescription}
                  </p>
                </div>
                {item.keyboardShortcut && (
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono">
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
