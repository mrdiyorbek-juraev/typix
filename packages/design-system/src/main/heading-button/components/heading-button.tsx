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
import { useHeading } from "../hooks/use-heading";
import type { HeadingButtonProps } from "../types";

export function HeadingButton({
  level,
  text,
  hideWhenUnavailable = false,
  showShortcut = false,
  onToggled,
  className,
}: HeadingButtonProps): JSX.Element | null {
  const {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label,
    shortcutKeys,
    Icon,
  } = useHeading(level, { hideWhenUnavailable, onToggled });

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
              className
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

HeadingButton.displayName = "Typix.HeadingButton";
