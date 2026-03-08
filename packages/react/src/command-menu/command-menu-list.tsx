import type { ReactNode } from "react";
import { cn } from "../lib/cn";

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
