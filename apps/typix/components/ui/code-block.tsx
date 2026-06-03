import * as Base from "fumadocs-ui/components/codeblock";
import { cn } from "@/lib/cn";
import { highlight } from "fumadocs-core/highlight";
import { shikiConfig } from "@/lib/shiki";

export interface CodeBlockProps {
  code: string;
  wrapper?: Base.CodeBlockProps;
  lang: string;
}

export async function CodeBlock({ code, lang, wrapper }: CodeBlockProps) {
  // fumadocs-core 16+ removed `config` from HighlightOptions; spread the
  // themes from shikiConfig directly and select the JS regex engine.
  const rendered = await highlight(code, {
    engine: "js",
    lang,
    ...shikiConfig.defaultThemes,
    components: {
      pre: Base.Pre,
    },
  });

  return (
    <Base.CodeBlock {...wrapper} className={cn("my-0", wrapper?.className)}>
      {rendered}
    </Base.CodeBlock>
  );
}
