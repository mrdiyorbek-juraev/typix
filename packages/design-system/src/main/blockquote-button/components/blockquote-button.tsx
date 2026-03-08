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
import { useBlockquote } from "../hooks/use-blockquote";
import type { BlockquoteButtonProps } from "../types";

export function BlockquoteButton({
  text,
  hideWhenUnavailable = false,
  showShortcut = false,
  onToggled,
  className,
}: BlockquoteButtonProps): JSX.Element | null {
  const {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label,
    shortcutKeys,
    Icon,
  } = useBlockquote({ hideWhenUnavailable, onToggled });

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
            onClick={handleToggle}
            disabled={!canToggle}
            data-active={isActive ? "" : undefined}
            aria-pressed={isActive}
            className={cn(
              "hover:[&_svg]:text-emerald-400 data-[active]:[&_svg]:text-emerald-500",
              className,
            )}
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

BlockquoteButton.displayName = "Typix.BlockquoteButton";
