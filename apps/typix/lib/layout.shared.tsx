import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { TypixLogo } from "@/components/logo";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <TypixLogo className="size-7" />
          <span className="font-semibold text-lg tracking-tight">Typix</span>
        </div>
      ),
      transparentMode: "top",
    },
  };
}
