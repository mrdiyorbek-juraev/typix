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
import { useListDropdownMenu } from "../hooks/use-list-dropdown-menu";
import type { ListDropdownMenuProps } from "../types";

export function ListDropdownMenu({
  types,
  hideWhenUnavailable = false,
  portal = true,
  onOpenChange,
  className,
}: ListDropdownMenuProps): JSX.Element | null {
  const [open, setOpen] = useState(false);

  const { isVisible, isActive, canToggle, items, label, Icon } =
    useListDropdownMenu({ types, hideWhenUnavailable });

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
                disabled={!canToggle}
                data-active={isActive ? "" : undefined}
                aria-pressed={isActive}
                className={cn(
                  "gap-0.5 hover:[&_svg]:text-emerald-400 data-[active]:[&_svg]:text-emerald-500",
                  className
                )}
              >
                <Icon />
                <ChevronDown className="!size-3 opacity-50" />
              </ToolbarButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="start" {...(!portal && { forceMount: true })}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.type}
            disabled={!item.canToggle}
            onSelect={() => {
              item.handleToggle();
              handleOpenChange(false);
            }}
            className={cn(
              "gap-2",
              item.isActive && "bg-accent text-accent-foreground"
            )}
          >
            <span className="[&_svg]:size-4">
              <item.Icon />
            </span>
            <span className="flex-1">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ListDropdownMenu.displayName = "Typix.ListDropdownMenu";
