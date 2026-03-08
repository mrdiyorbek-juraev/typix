import { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ToolbarButton } from "../../../primitives/toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../primitives/tooltip";
import { useFontSize } from "../hooks/use-font-size";
import type { FontSizeInputProps } from "../types";

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export function FontSizeInput({
  hideWhenUnavailable = false,
  onChanged,
  className,
}: FontSizeInputProps): JSX.Element | null {
  const {
    isVisible,
    currentSize,
    canIncrease,
    canDecrease,
    handleSetSize,
    handleIncrease,
    handleDecrease,
    minSize,
    maxSize,
  } = useFontSize({ hideWhenUnavailable, onChanged });

  const [draft, setDraft] = useState(String(currentSize));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(String(currentSize));
  }, [currentSize, dirty]);

  const apply = useCallback(() => {
    const size = parseFloat(draft);
    if (!isNaN(size) && size >= minSize && size <= maxSize) {
      handleSetSize(size);
    } else {
      setDraft(String(currentSize));
    }
    setDirty(false);
  }, [draft, minSize, maxSize, handleSetSize, currentSize]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        apply();
      } else if (e.key === "Escape") {
        setDraft(String(currentSize));
        setDirty(false);
      }
    },
    [apply, currentSize]
  );

  if (!isVisible) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("flex items-center gap-0.5", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton
              onClick={handleDecrease}
              disabled={!canDecrease}
              className="hover:[&_svg]:text-emerald-400"
            >
              <Minus className="size-3.5" />
            </ToolbarButton>
          </TooltipTrigger>
          <TooltipContent>Decrease Font Size</TooltipContent>
        </Tooltip>

        <input
          type="number"
          value={dirty ? draft : String(currentSize)}
          onChange={(e) => {
            setDraft(e.target.value);
            setDirty(true);
          }}
          onBlur={apply}
          onKeyDown={onKeyDown}
          onMouseDown={stopPropagation}
          className="h-7 w-10 rounded border border-border bg-transparent px-1 text-center text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          min={minSize}
          max={maxSize}
          title="Font Size"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <ToolbarButton
              onClick={handleIncrease}
              disabled={!canIncrease}
              className="hover:[&_svg]:text-emerald-400"
            >
              <Plus className="size-3.5" />
            </ToolbarButton>
          </TooltipTrigger>
          <TooltipContent>Increase Font Size</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

FontSizeInput.displayName = "Typix.FontSizeInput";
