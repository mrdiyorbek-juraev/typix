"use client";

import { useState, type JSX } from "react";
import { cn } from "../../../lib/utils";
import { ToolbarButton } from "../../../primitives/toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../primitives/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../primitives/popover";
import { ColorSelector } from "../../../primitives/color-selector";
import { useColorHighlight } from "../hooks/use-color-highlight";
import type { ColorHighlightButtonProps } from "../types";

const colorSwatchMap: Record<string, string> = {
  yellow: "var(--color-yellow-400)",
  amber: "var(--color-amber-400)",
  orange: "var(--color-orange-400)",
  lime: "var(--color-lime-400)",
  green: "var(--color-green-400)",
  cyan: "var(--color-cyan-400)",
  sky: "var(--color-sky-400)",
  pink: "var(--color-pink-400)",
  rose: "var(--color-rose-400)",
  fuchsia: "var(--color-fuchsia-400)",
};

export function ColorHighlightButton({
  text,
  defaultColor,
  hideWhenUnavailable = false,
  onToggled,
  onColorSelected,
  className,
}: ColorHighlightButtonProps): JSX.Element | null {
  const {
    isVisible,
    isActive,
    canToggle,
    selectedColor,
    handleColorSelected,
    handleRemoveHighlight,
    label,
    Icon,
    highlightColors,
  } = useColorHighlight({ defaultColor, hideWhenUnavailable, onToggled, onColorSelected });

  const [popoverOpen, setPopoverOpen] = useState(false);

  if (!isVisible) return null;

  const swatchColor = colorSwatchMap[selectedColor] ?? "var(--color-yellow-400)";

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("inline-flex items-stretch", className)}>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <ToolbarButton
                  disabled={!canToggle}
                  data-active={isActive ? "" : undefined}
                  aria-pressed={isActive}
                  className={cn(
                    "hover:[&_svg]:text-amber-400 data-[active]:[&_svg]:text-amber-500"
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <Icon />
                    <div
                      className="h-0.5 w-3.5 rounded-full"
                      style={{ backgroundColor: swatchColor }}
                    />
                  </div>
                  {text && <span>{text}</span>}
                </ToolbarButton>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>

          <PopoverContent
            side="bottom"
            sideOffset={8}
            align="start"
            className="w-auto rounded-lg p-3"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-medium text-muted-foreground">
                Highlight color
              </span>
              <ColorSelector
                colors={highlightColors}
                defaultValue={selectedColor}
                value={selectedColor}
                size="sm"
                onColorSelect={(color) => {
                  handleColorSelected(color);
                  setPopoverOpen(false);
                }}
              />
              {isActive && (
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveHighlight();
                    setPopoverOpen(false);
                  }}
                  className="mt-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Remove highlight
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}

ColorHighlightButton.displayName = "Typix.ColorHighlightButton";
