import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../primitives/popover";
import { cn } from "../../../lib/utils";
import type { ImageAlignmentPopoverProps, ImageAlignment } from "../types";

const alignmentOptions: { value: ImageAlignment; label: string; icon: React.ReactNode }[] = [
  {
    value: "left",
    label: "Left",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: "center",
    label: "Center",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: "full-width",
    label: "Full width",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function ImageAlignmentPopover({
  alignment,
  onAlignmentChange,
}: ImageAlignmentPopoverProps) {
  return (
    <PopoverContent
      side="top"
      sideOffset={8}
      className="flex w-auto gap-0.5 rounded-lg bg-[#1f1f1f] p-1 shadow-lg border-0"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {alignmentOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onAlignmentChange(option.value)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
            "text-white/80 hover:bg-white/10 hover:text-white",
            alignment === option.value && "bg-white/15 text-white"
          )}
          aria-label={option.label}
          title={option.label}
        >
          {option.icon}
        </button>
      ))}
    </PopoverContent>
  );
}

export { Popover as AlignmentPopoverRoot, PopoverTrigger as AlignmentPopoverTrigger };
