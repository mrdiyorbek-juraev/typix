import type { ReactNode } from "react";
import { useEditorCommand } from "../../context/command";
import { cn } from "../../utils";

export interface EditorCommandEmptyProps {
  children: ReactNode;
  className?: string;
}

export function EditorCommandEmpty({
  children,
  className,
}: EditorCommandEmptyProps) {
  const { filteredItems } = useEditorCommand();

  if (filteredItems?.length > 0) return null;

  return (
    <div className={cn("typix-editor-command-empty", className)}>
      {children}
    </div>
  );
}
