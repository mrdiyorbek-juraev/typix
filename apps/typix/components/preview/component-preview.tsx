"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { cn } from "@/lib/cn";
import { examples } from "./examples";

interface ComponentPreviewClassNames {
  /** Outermost wrapper — `not-prose my-6 overflow-hidden rounded-t-lg` */
  root?: string;
  /** Preview background layer — `bg-white dark:bg-fd-background` */
  preview?: string;
  /** Code section wrapper — `border-t border-fd-border bg-fd-secondary/50` */
  code?: string;
  /** Tab bar row — `flex border-b border-fd-border bg-fd-muted/80` */
  tabs?: string;
  /** Individual tab button (active / inactive via data attribute) */
  tab?: string;
  /** Code block wrapper div */
  codeBlock?: string;
}

interface ComponentPreviewProps {
  name: string;
  classNames?: ComponentPreviewClassNames;
}

function PreviewLoader() {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center gap-3">
      <div className="animate-pulse">
        <Image
          src="/logo.svg"
          alt="Typix"
          width={32}
          height={32}
          className="opacity-40"
        />
      </div>
      <span className="text-xs text-fd-muted-foreground">Loading preview…</span>
    </div>
  );
}

export function ComponentPreview({ name, classNames }: ComponentPreviewProps) {
  const example = examples[name];
  const [activeTab, setActiveTab] = useState(0);

  if (!example) {
    return (
      <div className="rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Example &quot;{name}&quot; not found.
      </div>
    );
  }

  const { component: Component, files } = example;
  const activeFile = files[activeTab];

  return (
    <div
      className={cn(
        "not-prose my-6 overflow-hidden rounded-t-lg",
        classNames?.root
      )}
    >
      <div
        className={cn("bg-white dark:bg-fd-background", classNames?.preview)}
      >
        <Suspense fallback={<PreviewLoader />}>
          <Component />
        </Suspense>
      </div>

      <div
        className={cn(
          "border-t border-fd-border bg-fd-secondary/50",
          classNames?.code
        )}
      >
        {files.length > 1 && (
          <div
            className={cn(
              "flex border-b border-fd-border bg-fd-muted/80",
              classNames?.tabs
            )}
          >
            {files.map((file, index) => (
              <button
                key={file.name}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-4 py-2 text-xs font-medium transition-colors",
                  index === activeTab
                    ? "border-b-2 border-fd-primary bg-fd-card text-fd-foreground"
                    : "text-fd-muted-foreground hover:text-fd-foreground",
                  classNames?.tab
                )}
              >
                {file.name}
              </button>
            ))}
          </div>
        )}

        {activeFile && (
          <div
            className={cn(
              "[&_pre]:!my-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_figure]:!my-0 [&_figure]:!rounded-none [&_figure]:!border-0",
              classNames?.codeBlock
            )}
          >
            <DynamicCodeBlock lang={activeFile.lang} code={activeFile.code} />
          </div>
        )}
      </div>
    </div>
  );
}
