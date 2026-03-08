import { useState } from "react";
import type { JSX } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ToolbarButton } from "../../../primitives/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../primitives/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../primitives/tooltip";
import { useFontFamilyDropdownMenu } from "../hooks/use-font-family-dropdown-menu";
import type { FontFamilyDropdownMenuProps } from "../types";

export function FontFamilyDropdownMenu({
  families,
  hideWhenUnavailable = false,
  portal = true,
  onOpenChange,
  className,
}: FontFamilyDropdownMenuProps): JSX.Element | null {
  const [open, setOpen] = useState(false);

  const { isVisible, currentFamily, currentLabel, items, handleSelect } =
    useFontFamilyDropdownMenu({ families, hideWhenUnavailable });

  if (!isVisible) return null;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <ToolbarButton
                className={cn(
                  "gap-0.5 min-w-[5rem] justify-between",
                  className
                )}
              >
                <span
                  className="truncate text-xs"
                  style={
                    currentFamily ? { fontFamily: currentFamily } : undefined
                  }
                >
                  {currentLabel}
                </span>
                <ChevronDown className="!size-3 opacity-50" />
              </ToolbarButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Font Family</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="start" {...(!portal && { forceMount: true })}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onSelect={() => {
              handleSelect(item.value);
              handleOpenChange(false);
            }}
            style={item.value ? { fontFamily: item.value } : undefined}
            className={cn(
              "gap-2",
              item.value === currentFamily && "bg-accent text-accent-foreground"
            )}
          >
            <span className="flex-1">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

FontFamilyDropdownMenu.displayName = "Typix.FontFamilyDropdownMenu";
