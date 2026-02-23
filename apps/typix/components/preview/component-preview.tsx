"use client";

import { Suspense, useState } from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { cn } from "@/lib/cn";
import { examples } from "./examples";

interface ComponentPreviewProps {
  name: string;
}

export function ComponentPreview({ name }: ComponentPreviewProps) {
  const example = examples[name];
  const [activeTab, setActiveTab] = useState(0);

  if (!example) {
    return (
      <div className="rounded-lg border border-fd-border p-4 text-sm text-fd-muted-foreground">
        Example "{name}" not found.
      </div>
    );
  }

  const { component: Component, files } = example;
  const activeFile = files[activeTab];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-t-lg ">
      <div className="bg-white  dark:bg-fd-background">
        <Suspense
          fallback={
            <div className="flex min-h-[120px] items-center justify-center text-sm text-fd-muted-foreground">
              Loading preview...
            </div>
          }
        >
          <Component />
        </Suspense>
      </div>

      <div className="border-t border-fd-border bg-fd-secondary/50">
        {files.length > 1 && (
          <div className="flex border-b border-fd-border bg-fd-muted/80">
            {files.map((file, index) => (
              <button
                key={file.name}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-4 py-2 text-xs font-medium transition-colors",
                  index === activeTab
                    ? "border-b-2 border-fd-primary bg-fd-card text-fd-foreground"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                )}
              >
                {file.name}
              </button>
            ))}
          </div>
        )}

        {activeFile && (
          <div className="[&_pre]:!my-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_figure]:!my-0 [&_figure]:!rounded-none [&_figure]:!border-0">
            <DynamicCodeBlock lang={activeFile.lang} code={activeFile.code} />
          </div>
        )}
      </div>
    </div>
  );
}
