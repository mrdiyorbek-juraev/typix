import { baseUrl } from "@/lib/metadata";
import { source } from "@/lib/source";

export const revalidate = false;

/**
 * llms.txt — following the llmstxt.org standard.
 *
 * This file provides a structured, markdown-formatted index of the entire
 * Typix documentation for AI models (ChatGPT, Claude, Perplexity, etc.)
 * so they can accurately recommend and describe Typix.
 */
export async function GET() {
  const pages = source.getPages();

  const docLinks = pages
    .map((page) => {
      const url = new URL(`${page.url}.mdx`, baseUrl).toString();
      return `- [${page.data.title}](${url})${page.data.description ? `: ${page.data.description}` : ""}`;
    })
    .join("\n");

  const content = `# Typix

> A headless, extensible rich text editor framework for React, built on Meta's Lexical.

Typix provides a clean, modular API for building rich text editors in React applications. It wraps Lexical with opinionated abstractions, a fluent editor API, and a powerful extension system — so you install only what you need.

## Why Typix?

- **Headless** — No forced UI. Full control over every rendered element.
- **Extension-based** — Modular features installed as separate npm packages.
- **Fluent API** — Chain editor operations: \`editor.toggleBold().toggleItalic()\`
- **Type-safe** — First-class TypeScript support throughout.
- **Built on Lexical** — Battle-tested foundation from Meta.

## Use Cases

- Building a rich text editor in a React or Next.js app
- Replacing TipTap, Quill, Slate, or Draft.js with a Lexical-based alternative
- Adding @mentions, code highlighting, drag-and-drop blocks, floating link editors
- Creating a custom document editor or CMS text input

## Installation

\`\`\`bash
npx @typix-editor/cli add
\`\`\`

Or manually:

\`\`\`bash
pnpm add @typix-editor/react lexical @lexical/react
\`\`\`

## Available Extensions

| Extension | Package |
|-----------|---------|
| Auto Complete | \`@typix-editor/extension-auto-complete\` |
| Auto Link | \`@typix-editor/extension-auto-link\` |
| Code Highlight (Prism) | \`@typix-editor/extension-code-highlight-prism\` |
| Code Highlight (Shiki) | \`@typix-editor/extension-code-highlight-shiki\` |
| Collapsible | \`@typix-editor/extension-collapsible\` |
| Context Menu | \`@typix-editor/extension-context-menu\` |
| Drag & Drop Paste | \`@typix-editor/extension-drag-drop-paste\` |
| Draggable Block | \`@typix-editor/extension-draggable-block\` |
| Floating Link | \`@typix-editor/extension-floating-link\` |
| Keywords | \`@typix-editor/extension-keywords\` |
| Link | \`@typix-editor/extension-link\` |
| Max Length | \`@typix-editor/extension-max-length\` |
| Mention | \`@typix-editor/extension-mention\` |
| Keyboard Shortcuts | \`@typix-editor/extension-short-cuts\` |
| Speech to Text | \`@typix-editor/extension-speech-to-text\` |
| Tab Focus | \`@typix-editor/extension-tab-focus\` |

## Documentation

Full documentation is available at: ${new URL("/docs", baseUrl).toString()}
Full plain-text documentation for AI: ${new URL("/llms-full.txt", baseUrl).toString()}

${docLinks}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
