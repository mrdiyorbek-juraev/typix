"use client";

import { useState, useCallback, type JSX } from "react";
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
import {
  useColorText,
  TEXT_COLOR_VALUES,
  HIGHLIGHT_GRID_VALUES,
} from "../hooks/use-color-text";
import type { ColorTextButtonProps } from "../types";

const highlightBorderMap: Record<string, string> = {
  yellow: "var(--color-yellow-300)",
  amber: "var(--color-amber-300)",
  orange: "var(--color-orange-300)",
  lime: "var(--color-lime-300)",
  green: "var(--color-green-300)",
  cyan: "var(--color-cyan-300)",
  sky: "var(--color-sky-300)",
  blue: "var(--color-blue-300)",
  purple: "var(--color-purple-300)",
  pink: "var(--color-pink-300)",
  rose: "var(--color-rose-300)",
  fuchsia: "var(--color-fuchsia-300)",
};

// ── Recently-used tracking ───────────────────────────────────────────────────

type RecentItem = { type: "text" | "highlight"; color: string };

// ── Component ────────────────────────────────────────────────────────────────

export function ColorTextButton({
  text,
  defaultColor,
  hideWhenUnavailable = false,
  onColorSelected,
  className,
}: ColorTextButtonProps): JSX.Element | null {
  const {
    isVisible,
    isActive,
    isHighlightActive,
    selectedColor,
    handleColorSelected,
    handleHighlightSelected,
    handleRemoveColor,
    handleRemoveHighlight,
    label,
    Icon,
    textColors,
    highlightColors,
  } = useColorText({ defaultColor, hideWhenUnavailable, onColorSelected });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  const addRecent = useCallback((item: RecentItem) => {
    setRecentItems((prev) => {
      const filtered = prev.filter(
        (i) => !(i.type === item.type && i.color === item.color)
      );
      return [item, ...filtered].slice(0, 6);
    });
  }, []);

  if (!isVisible) return null;

  const swatchColor = TEXT_COLOR_VALUES[selectedColor] ?? "var(--foreground)";

  const pickTextColor = (color: string) => {
    handleColorSelected(color);
    addRecent({ type: "text", color });
    setPopoverOpen(false);
  };

  const pickHighlightColor = (color: string) => {
    handleHighlightSelected(color);
    addRecent({ type: "highlight", color });
    setPopoverOpen(false);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("inline-flex items-stretch", className)}>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <ToolbarButton
                  data-active={isActive ? "" : undefined}
                  aria-pressed={isActive}
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
            className="w-auto rounded-xl p-4"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-3.5">
              {/* ── Recently Used ── */}
              {recentItems.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Recently Used
                  </span>
                  <div className="flex gap-2">
                    {recentItems.map((item) =>
                      item.type === "text" ? (
                        <TextColorSwatch
                          key={`text-${item.color}`}
                          color={item.color}
                          isSelected={false}
                          onClick={() => pickTextColor(item.color)}
                        />
                      ) : (
                        <HighlightColorSwatch
                          key={`hl-${item.color}`}
                          color={item.color}
                          isSelected={false}
                          onClick={() => pickHighlightColor(item.color)}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ── Text Color ── */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Text Color
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {textColors.map((color) => (
                    <TextColorSwatch
                      key={color}
                      color={color}
                      isSelected={selectedColor === color}
                      onClick={() => pickTextColor(color)}
                    />
                  ))}
                </div>
                {isActive && (
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveColor();
                      setPopoverOpen(false);
                    }}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    Reset text color
                  </button>
                )}
              </div>

              {/* ── Highlight Color ── */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Highlight Color
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {highlightColors.map((color) => (
                    <HighlightColorSwatch
                      key={color}
                      color={color}
                      isSelected={false}
                      onClick={() => pickHighlightColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}

ColorTextButton.displayName = "Typix.ColorTextButton";

// ── Sub-components ───────────────────────────────────────────────────────────

function TextColorSwatch({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const colorValue = TEXT_COLOR_VALUES[color] ?? "var(--foreground)";
  return (
    <button
      type="button"
      className={cn(
        "size-5 rounded-full flex items-center justify-center",
        "border-[1] transition-all duration-150 active:scale-95",
        "cursor-pointer text-xs font-semibold leading-none",
        isSelected
          ? "ring-2 ring-offset-1 ring-offset-background"
          : "hover:brightness-110"
      )}
      style={{
        color: colorValue,
        borderColor: colorValue,
        ...(isSelected && { ringColor: colorValue }),
      }}
      onClick={onClick}
      aria-label={`${color} text color`}
      aria-pressed={isSelected}
    >
      A
    </button>
  );
}

function HighlightColorSwatch({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const fillValue =
    HIGHLIGHT_GRID_VALUES[color] ?? HIGHLIGHT_GRID_VALUES.yellow;
  const borderValue = highlightBorderMap[color] ?? highlightBorderMap.yellow;
  return (
    <button
      type="button"
      className={cn(
        "size-5 rounded-full transition-all duration-150 active:scale-95",
        "border cursor-pointer",
        isSelected
          ? "ring-1 ring-offset-1 ring-offset-background"
          : "hover:brightness-110"
      )}
      style={{
        backgroundColor: fillValue,
        borderColor: borderValue,
      }}
      onClick={onClick}
      aria-label={`${color} highlight`}
      aria-pressed={isSelected}
    />
  );
}
