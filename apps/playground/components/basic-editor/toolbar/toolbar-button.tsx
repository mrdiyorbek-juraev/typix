"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      size="icon-sm"
      variant="ghost"
      title={title}
      aria-pressed={active}
      className={cn("size-7", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}
