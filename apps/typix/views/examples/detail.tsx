"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ComponentPreview } from "@/components/preview/component-preview";
import type { ExampleConfig } from "./data";
import { getRelatedExamples } from "./data";
import { ComplexityDots } from "./components/complexity-dots";
import { NotifyForm } from "./components/notify-form";

interface ExampleDetailPageProps {
  example: ExampleConfig;
}

export default function ExampleDetailPage({ example }: ExampleDetailPageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryLabel =
    example.category.charAt(0).toUpperCase() + example.category.slice(1);
  const related = getRelatedExamples(example.relatedSlugs ?? []);

  return (
    <div className="mx-auto max-w-[1400px] overflow-hidden px-4 pt-8 pb-20 sm:px-6 md:pt-12 lg:pt-16 w-full">
      {/* Top bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild size="sm" variant="ghost">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            Back to examples
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/docs">
            <ExternalLink className="size-3.5" />
            View docs
          </Link>
        </Button>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* ── Left sidebar — collapses on maximize */}
        <aside
          className={`flex flex-col gap-5 overflow-hidden lg:shrink-0 lg:sticky lg:top-24 lg:self-start transition-all duration-300 ease-in-out ${
            isExpanded
              ? "w-0 opacity-0 pointer-events-none lg:w-0"
              : "opacity-100 lg:w-[280px]"
          }`}
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {categoryLabel}
            </Badge>
            {!example.available && (
              <Badge
                variant="secondary"
                className="border border-border text-[10px] font-medium uppercase tracking-wider"
              >
                Coming soon
              </Badge>
            )}
          </div>

          {/* Title + description */}
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl tracking-tight">
              {example.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {example.description}
            </p>
          </div>

          {/* Complexity */}
          {example.complexity && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Complexity
              </span>
              <ComplexityDots complexity={example.complexity} />
            </div>
          )}

          {/* Tags */}
          {example.tags && example.tags.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {example.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related examples */}
          {related.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Related
                </span>
                <ul className="flex flex-col gap-1">
                  {related.map((rel) => {
                    const content = (
                      <span
                        className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                          rel.available
                            ? "text-foreground hover:bg-muted"
                            : "cursor-not-allowed text-muted-foreground/60"
                        }`}
                      >
                        <span className="text-muted-foreground/40">→</span>
                        {rel.title}
                        {!rel.available && (
                          <span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground/40">
                            soon
                          </span>
                        )}
                      </span>
                    );

                    if (!rel.available) {
                      return <li key={rel.slug}>{content}</li>;
                    }
                    return (
                      <li key={rel.slug}>
                        <Link href={`/examples/${rel.slug}`}>{content}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </aside>

        {/* ── Right panel — expands to full width */}
        <div className="min-w-0 flex-1 transition-all duration-300 ease-in-out">
          {/* Card wrapper:
              [&_.not-prose]:my-0  → negates the my-6 baked into ComponentPreview
                                     so no margin bleeds outside the border card    */}
          <div className="overflow-hidden rounded-xl border border-border bg-card [&_.not-prose]:my-0 [&_.not-prose]:rounded-none">
            {/* Toolbar: maximize/minimize (only when a live preview exists) */}
            {example.previewName && (
              <div className="flex items-center justify-end border-b border-border/60 px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setIsExpanded((v) => !v)}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={
                    isExpanded ? "Minimize preview" : "Maximize preview"
                  }
                >
                  {isExpanded ? (
                    <>
                      <Minimize2 className="size-3" />
                      Minimize
                    </>
                  ) : (
                    <>
                      <Maximize2 className="size-3" />
                      Maximize
                    </>
                  )}
                </button>
              </div>
            )}

            {example.previewName ? (
              <ComponentPreview
                name={example.previewName}
                classNames={{
                  preview:
                    "[&_div]:border-t-0 [&_div]:border-r-0  [&_div]:border-l-0 [&_div]:rounded-none",
                }}
              />
            ) : (
              <NotifyForm
                exampleSlug={example.slug}
                exampleTitle={example.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
