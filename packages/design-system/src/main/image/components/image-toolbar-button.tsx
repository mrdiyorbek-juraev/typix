import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../primitives/tooltip";
import { cn } from "../../../lib/utils";
import type { ImageToolbarButtonProps } from "../types";

export function ImageToolbarButton({
  icon,
  label,
  onClick,
  isActive = false,
}: ImageToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
            "text-white/80 hover:bg-white/10 hover:text-white",
            isActive && "bg-white/15 text-white"
          )}
          aria-label={label}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
