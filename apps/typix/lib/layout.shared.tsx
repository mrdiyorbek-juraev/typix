import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { TypixLogo } from "@/components/logo";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-1">
          <TypixLogo className="size-7 invert dark:invert-0" />
          <span className="font-semibold text-lg tracking-tight text-black dark:text-white">
            Typix
          </span>
        </div>
      ),
      transparentMode: "top",
    },
  };
}
