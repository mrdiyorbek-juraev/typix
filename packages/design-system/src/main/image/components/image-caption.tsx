import { cn } from "../../../lib/utils";
import type { ImageCaptionProps } from "../types";

export function ImageCaption({
  caption,
  onChange,
  placeholder = "Add a caption",
}: ImageCaptionProps) {
  return (
    <input
      type="text"
      value={caption}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "mt-2 w-full bg-transparent text-center text-sm text-muted-foreground",
        "outline-none placeholder:text-muted-foreground/50",
        "border-none p-1"
      )}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    />
  );
}
