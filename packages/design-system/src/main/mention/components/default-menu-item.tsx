import type { JSX } from "react";
import type { MentionMenuItemProps } from "@typix-editor/extension-mention";
import { cn } from "../../../lib/utils";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../primitives/avatar";

export function DefaultMenuItem({
  item,
  index,
  isSelected,
  onClick,
  onMouseEnter,
  setRefElement,
}: MentionMenuItemProps): JSX.Element {
  const avatarSrc = item.data?.avatar as string | undefined;
  const subtitle = (item.data?.subtitle ?? item.data?.username) as
    | string
    | undefined;
  const initials = item.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <li
      aria-selected={isSelected}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-100",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-popover-foreground hover:bg-accent/50"
      )}
      id={`typix-mention-item-${index}`}
      key={item.id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={setRefElement}
      role="option"
      tabIndex={-1}
    >
      <Avatar className="size-7 text-[11px]">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={item.name} />}
        <AvatarFallback className="text-[11px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium leading-tight">{item.name}</span>
        {subtitle && (
          <span className="truncate text-xs text-muted-foreground leading-tight">
            {subtitle}
          </span>
        )}
      </span>
    </li>
  );
}
