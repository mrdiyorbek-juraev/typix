"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/preview/component-preview";
import type { ExampleConfig } from "../data";
import { ComplexityDots } from "./complexity-dots";

interface FeaturedExampleCardProps {
  example: ExampleConfig;
}

export function FeaturedExampleCard({ example }: FeaturedExampleCardProps) {
  const categoryLabel =
    example.category.charAt(0).toUpperCase() + example.category.slice(1);

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid lg:grid-cols-2">
        {/* Left — metadata */}
        <div className="flex flex-col justify-center gap-5 p-8 lg:border-r lg:border-border/60">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-medium">
              Featured
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {categoryLabel}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl tracking-tight">{example.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {example.description}
            </p>
          </div>

          {example.tags && example.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {example.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <ComplexityDots complexity={example.complexity} />

          <Button asChild size="sm" className="w-fit">
            <Link href={`/examples/${example.slug}`}>
              Explore example
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Right — live preview */}
        <div className="border-t border-border/60 bg-muted/20 lg:border-t-0">
          {example.previewName ? (
            <div className="[&_.not-prose]:my-0 [&_.not-prose]:rounded-none">
              <Suspense
                fallback={
                  <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
                    Loading preview...
                  </div>
                }
              >
                <ComponentPreview name={example.previewName} classNames={{ preview: "[&_div]:border-t-0 [&_div]:border-r-0  [&_div]:border-l-0 [&_div]:rounded-none", codeBlock: "max-h-[420px] overflow-y-auto"}}/>
              </Suspense>
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
              Preview not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
