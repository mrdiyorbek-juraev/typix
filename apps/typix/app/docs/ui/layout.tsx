import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { uiSource } from "@/lib/source/ui";
import { linkItems } from "@/components/layout/header";
import { TypixLogo } from "@/components/logo";
import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
} from "@/components/ai/search";
import { cn } from "@/lib/cn";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { MessageCircleIcon, Layers, Palette } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";
import "katex/dist/katex.min.css";

function collectUrls(nodes: PageTree.Node[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") return [node.url];
    if (node.type === "folder") return collectUrls(node.children);
    return [];
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  const base = baseOptions();
  const tree = uiSource.getPageTree();
  const uiUrls = new Set(collectUrls(tree.children));

  return (
    <DocsLayout
      tree={tree}
      links={linkItems.filter((item) => item.type === "icon")}
      nav={{
        ...base.nav,
        title: (
          <>
            <TypixLogo className="size-7 invert dark:invert-0" />
            <span className="font-medium in-[.uwu]:hidden max-md:hidden">
              Typix
            </span>
          </>
        ),
      }}
      sidebar={{
        tabs: [
          {
            title: "Framework",
            description: "The editor framework",
            icon: (
              <div className="flex size-full items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Layers className="size-3.5" />
              </div>
            ),
            url: "/docs/getting-started/quick-start",
            urls: new Set<string>(),
          },
          {
            title: "Typix UI",
            description: "UI components library",
            icon: (
              <div className="flex size-full items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Palette className="size-3.5" />
              </div>
            ),
            url: "/docs/ui",
            urls: uiUrls,
          },
        ],
      }}
    >
      {children}
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "text-fd-muted-foreground rounded-2xl",
            })
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>
    </DocsLayout>
  );
}
