"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExampleCard, FeaturedExampleCard } from "./components";
import { categories, examples, getFeaturedExample } from "./data";

export default function ExamplesPage() {
  const featured = getFeaturedExample();
  const gridExamples = examples.filter((e) => !e.featured);

  function countForCategory(value: string) {
    if (value === "all") return examples.length;
    return examples.filter((e) => e.category === value).length;
  }

  return (
    <div className="relative">
      {/* Hero header */}
      <div className="border-b border-border/40 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent">
        <div className="mx-auto max-w-[1400px] px-4 pt-16 pb-12 sm:px-6 md:pt-20 md:pb-14 lg:pt-28 lg:pb-16">
          <div className="flex flex-col gap-5">
            <Badge
              variant="outline"
              className="w-fit gap-2 border-emerald-500/30 px-3 py-1 text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Examples
            </Badge>

            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
              See what you can{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                build
              </span>
            </h1>

            <p className="max-w-2xl text-muted-foreground text-base leading-relaxed sm:text-lg">
              Explore real-world editor configurations built with Typix. Each
              example showcases a different use case — from simple text inputs
              to AI-powered interfaces — so you can find the right starting
              point for your next project.
            </p>

            <div className="mt-1 flex items-center gap-3">
              <Button asChild size="sm">
                <Link href="/docs">
                  Get started
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 pb-20 sm:px-6 md:pt-12">
        <Tabs defaultValue="all">
          <TabsList className="mb-8 h-auto flex-wrap gap-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="flex items-center gap-1.5"
              >
                {cat.label}
                <Badge
                  variant="outline"
                  className="rounded-sm px-1 text-[10px] font-medium tabular-nums"
                >
                  {countForCategory(cat.value)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All tab — featured card + grid */}
          <TabsContent value="all">
            {featured && <FeaturedExampleCard example={featured} />}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridExamples.map((example, i) => (
                <ExampleCard key={example.slug} example={example} index={i} />
              ))}
            </div>
          </TabsContent>

          {/* Category tabs — just grid, no featured card */}
          {categories
            .filter((cat) => cat.value !== "all")
            .map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {examples
                    .filter((e) => e.category === cat.value)
                    .map((example, i) => (
                      <ExampleCard
                        key={example.slug}
                        example={example}
                        index={i}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
        </Tabs>
      </div>
    </div>
  );
}
