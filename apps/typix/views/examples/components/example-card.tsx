"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
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

interface ExampleCardProps {
  example: ExampleConfig;
  index: number;
}

export function ExampleCard({ example, index }: ExampleCardProps) {
  const Illustration = illustrations[example.slug];
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
        className={`group relative h-full gap-0 overflow-hidden p-0 transition-all ${
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

        {/* Illustration area */}
        <div className="relative flex h-[180px] items-center justify-center overflow-hidden bg-gradient-to-br from-muted/50 to-muted text-muted-foreground/60 dark:from-muted/30 dark:to-muted/60">
          {Illustration && <Illustration />}
        </div>

        {/* Content */}
        <CardHeader className="gap-1.5 px-5 pt-5 pb-0">
          <CardTitle className="text-base">{example.title}</CardTitle>
          <CardDescription className="leading-relaxed">
            {example.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-0" />

        {/* Footer */}
        <CardFooter className="justify-between border-t border-border/40 px-5 py-3">
          <Badge
            variant="outline"
            className="px-2 py-0.5 text-xs font-normal"
          >
            {categoryLabel}
          </Badge>
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
