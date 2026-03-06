import { Popover, PopoverTrigger } from "../../../primitives/popover";
import { TooltipProvider } from "../../../primitives/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeftRight,
  Download,
  MoreHorizontal,
  Trash2,
  Type,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import type { ImageAlignment, ImageToolbarProps } from "../types";
import { ImageAlignmentPopover } from "./image-alignment-popover";
import { ImageToolbarButton } from "./image-toolbar-button";

const alignmentIcons: Record<ImageAlignment, React.ReactNode> = {
  left: <AlignLeft size={15} />,
  center: <AlignCenter size={15} />,
  right: <AlignRight size={15} />,
  "full-width": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

export function ImageToolbar({
  alignment,
  showCaption,
  onAlignmentChange,
  onToggleCaption,
  onDelete,
  onReplace,
  onDownload,
}: Omit<ImageToolbarProps, "onExpand" | "onDuplicate">) {
  const [showMore, setShowMore] = useState(false);

  return (
    <TooltipProvider delayDuration={300}>
    <div
      className={cn(
        "typix-image-toolbar",
        "absolute top-2 right-2 z-50",
        "flex items-center gap-0.5 rounded-lg p-1 shadow-lg",
        "animate-fade-in"
      )}
      style={{ backgroundColor: "#1f1f1f", backdropFilter: "none" }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Replace */}
      <ImageToolbarButton
        icon={<ArrowLeftRight size={15} />}
        label="Replace"
        onClick={onReplace}
      />

      {/* Caption */}
      <ImageToolbarButton
        icon={<Type size={15} />}
        label="Caption"
        onClick={onToggleCaption}
        isActive={showCaption}
      />

      <Separator />

      {/* Alignment */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-sm transition-colors",
              "text-white/80 hover:bg-white/10 hover:text-white"
            )}
            aria-label="Alignment"
          >
            {alignmentIcons[alignment]}
          </button>
        </PopoverTrigger>
        <ImageAlignmentPopover
          alignment={alignment}
          onAlignmentChange={onAlignmentChange}
        />
      </Popover>

      {/* Download */}
      <ImageToolbarButton
        icon={<Download size={15} />}
        label="Download"
        onClick={onDownload}
      />

      <Separator />

      {/* More (Delete) */}
      <div className="relative">
        <ImageToolbarButton
          icon={<MoreHorizontal size={15} />}
          label="More"
          onClick={() => setShowMore(!showMore)}
        />
        {showMore && (
          <div
            className={cn(
              "absolute top-full right-0 mt-1 min-w-[140px]",
              "rounded-lg p-1 shadow-lg",
              "animate-fade-in"
            )}
            style={{ backgroundColor: "#1f1f1f", backdropFilter: "none" }}
          >
            <button
              type="button"
              onClick={() => {
                setShowMore(false);
                onDelete();
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                "text-red-400 hover:bg-white/10"
              )}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}

function Separator() {
  return <div className="mx-0.5 h-4 w-px bg-white/20" />;
}
