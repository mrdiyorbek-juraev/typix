"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExampleConfig } from "./data";
import { EditorPlaceholder } from "./editors/placeholder";

interface ExampleDetailPageProps {
  example: ExampleConfig;
}

export default function ExampleDetailPage({ example }: ExampleDetailPageProps) {
  const categoryLabel =
    example.category.charAt(0).toUpperCase() + example.category.slice(1);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8 pb-20 sm:px-6 md:pt-12 lg:pt-16 w-full">
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

      {/* Title section */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {categoryLabel}
          </Badge>
        </div>
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {example.title}
        </h1>
        <p className="max-w-2xl text-muted-foreground text-sm sm:text-base">
          {example.description}
        </p>
      </div>

      {/* Editor area */}
      <div className="rounded-xl border border-border bg-card">
        <EditorPlaceholder example={example} />
      </div>
    </div>
  );
}
