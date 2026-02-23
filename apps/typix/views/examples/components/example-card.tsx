"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExampleConfig } from "../data";
import { illustrations } from "./card-illustrations";
import { ComplexityDots } from "./complexity-dots";
import Image from "next/image";

interface ExampleCardProps {
  example: ExampleConfig;
  index: number;
}

export function ExampleCard({ example, index }: ExampleCardProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  const hasIllustration = example.slug in illustrations;
  const categoryLabel =
    example.category.charAt(0).toUpperCase() + example.category.slice(1);

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="h-full"
    >
      <Card
        className={`group relative flex h-full flex-col gap-0 overflow-hidden p-0 transition-all ${
          example.available
            ? "hover:border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
            : "pointer-events-none opacity-55 grayscale-[40%]"
        }`}
      >
        {/* Coming Soon badge */}
        {!example.available && (
          <div className="absolute top-3 right-3 z-10">
            <Badge
              variant="secondary"
              className="border border-border bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm"
            >
              Coming soon
            </Badge>
          </div>
        )}

        {/* Illustration — served as an image from /api/illustration/[slug] */}
        <div className="relative h-[200px] shrink-0 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          {hasIllustration ? (
            <img
              src={`/api/illustration/${example.slug}?theme=${theme}`}
              alt=""
              aria-hidden="true"
              width={320}
              height={200}
              className="h-full w-full object-contain"
              key={theme}
              // next-themes resolvedTheme is undefined on the server, so the
              // ?theme= param will differ between SSR and the first client render.
              suppressHydrationWarning
            />
          ) : (
            // Fallback: empty muted area
            <div className="h-full w-full" />
          )}
        </div>

        {/* Header — title + 2-line description */}
        <CardHeader className="gap-1.5 px-5 pt-5 pb-0">
          <CardTitle className="text-base">{example.title}</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            {example.description}
          </CardDescription>
        </CardHeader>

        {/* Tags — flex-1 so footer is always pinned to bottom */}
        <CardContent className="flex flex-1 flex-col justify-end px-5 pb-0 pt-3">
          {example.tags && example.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {example.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="mt-3 justify-between border-t border-border/40 px-5 py-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-xs font-normal"
            >
              {categoryLabel}
            </Badge>
            <ComplexityDots complexity={example.complexity} />
          </div>
          <ArrowRight
            className={`size-4 text-muted-foreground transition-transform ${
              example.available
                ? "group-hover:translate-x-0.5 group-hover:text-foreground"
                : ""
            }`}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );

  if (!example.available) {
    return <div className="cursor-not-allowed">{card}</div>;
  }

  return (
    <Link href={`/examples/${example.slug}`} className="block h-full">
      {card}
    </Link>
  );
}
