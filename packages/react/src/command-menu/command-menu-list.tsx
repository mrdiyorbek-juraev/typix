import { cn } from "@typix-editor/utils";
import type { ReactNode } from "react";

export interface EditorCommandListProps {
  children: ReactNode;
  className?: string;
}

export function EditorCommandList({
  children,
  className,
}: EditorCommandListProps) {
  return (
    <ul className={cn("typix-editor-command-list", className)} role="listbox">
      {children}
    </ul>
  );
}
