import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  // @ts-expect-error
  return {
    ...defaultMdxComponents,
    ...components,
  };
}
