import type { JSX } from "react";
import { cn } from "../../../lib/utils";
import { ToolbarButton } from "../../../primitives/toolbar";
import { Kbd } from "../../../primitives/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../primitives/tooltip";
import { useTextAlign } from "../hooks/use-text-align";
import type { TextAlignButtonProps } from "../types";

export function TextAlignButton({
  align,
  text,
  hideWhenUnavailable = false,
  showShortcut = false,
  onAligned,
  className,
}: TextAlignButtonProps): JSX.Element | null {
  const { isVisible, canAlign, handleTextAlign, label, shortcutKeys, Icon } =
    useTextAlign(align, { hideWhenUnavailable, onAligned });

  if (!isVisible) return null;

  const shortcutBadges = shortcutKeys.map((key) => (
    <Kbd key={key} className="min-w-[1.25rem] justify-center">
      {key}
    </Kbd>
  ));

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton
            onClick={handleTextAlign}
            disabled={!canAlign}
            className={cn("hover:[&_svg]:text-emerald-400", className)}
          >
            <Icon />
            {text && <span>{text}</span>}
            {showShortcut && (
              <span className="ml-1 inline-flex items-center gap-0.5">
                {shortcutBadges}
              </span>
            )}
          </ToolbarButton>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          <span>{label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

TextAlignButton.displayName = "Typix.TextAlignButton";
