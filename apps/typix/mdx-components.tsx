import { Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  // @ts-expect-error
  return {
    ...defaultMdxComponents,
    Steps,
    Tab,
    Tabs,
    ...components,
  };
}
