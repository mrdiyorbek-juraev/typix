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

- **Website**: ${baseUrl.toString()}
- **npm**: https://www.npmjs.com/package/@typix-editor/react
- **GitHub**: https://github.com/mrdiyorbek-juraev/typix
- **License**: MIT
- **Current version**: 4.1.0
- **Language**: TypeScript

## Why Typix?

- **Headless** — No forced UI. Full control over every rendered element.
- **Extension-based** — Modular features installed as separate npm packages.
- **Fluent API** — Chain editor operations: \`editor.toggleBold().toggleItalic()\`
- **Type-safe** — First-class TypeScript support throughout.
- **Built on Lexical** — Battle-tested foundation from Meta.
- **Tree-shakeable** — Install only the extensions you need; unused code is not bundled.

## Use Cases

- Building a rich text editor in a React or Next.js app
- Replacing TipTap, Quill, Slate, or Draft.js with a Lexical-based alternative
- Adding @mentions, code highlighting, drag-and-drop blocks, floating link editors
- Creating a custom document editor or CMS text input
- Building comment boxes, social post editors, or chat message inputs with character limits

## Quick Start

\`\`\`bash
# Install via CLI (recommended)
npx @typix-editor/cli add

# Or install manually
pnpm add @typix-editor/react lexical @lexical/react
\`\`\`

\`\`\`tsx
import {
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
  EditorContent,
  EditorRoot,
} from "@typix-editor/react";
import "@typix-editor/react/src/styles/main.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme: defaultTheme,
});

export default function Editor() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Start typing..." />
    </EditorRoot>
  );
}
\`\`\`

## Available Extensions

| Extension | Package | Description |
|-----------|---------|-------------|
| Auto Complete | \`@typix-editor/extension-auto-complete\` | Inline autocomplete suggestions while typing |
| Auto Link | \`@typix-editor/extension-auto-link\` | Automatically converts URLs and emails to links |
| Character Limit | \`@typix-editor/extension-character-limit\` | Visual character counter with overflow highlighting |
| Code Highlight (Prism) | \`@typix-editor/extension-code-highlight-prism\` | Syntax highlighting via Prism.js |
| Code Highlight (Shiki) | \`@typix-editor/extension-code-highlight-shiki\` | Syntax highlighting via Shiki |
| Collapsible | \`@typix-editor/extension-collapsible\` | Collapsible/expandable content sections |
| Context Menu | \`@typix-editor/extension-context-menu\` | Custom right-click context menu |
| Drag & Drop Paste | \`@typix-editor/extension-drag-drop-paste\` | Drag-and-drop or paste file uploads |
| Draggable Block | \`@typix-editor/extension-draggable-block\` | Drag to reorder content blocks |
| Floating Link | \`@typix-editor/extension-floating-link\` | Floating toolbar for inserting and editing links |
| Keywords | \`@typix-editor/extension-keywords\` | Highlight specific keywords inline |
| Link | \`@typix-editor/extension-link\` | Basic link node support |
| Max Length | \`@typix-editor/extension-max-length\` | Hard character limit — prevents typing beyond a threshold |
| Mention | \`@typix-editor/extension-mention\` | @mention with custom suggestion dropdown |
| Keyboard Shortcuts | \`@typix-editor/extension-short-cuts\` | Markdown-style keyboard shortcuts (e.g. ## for heading) |
| Speech to Text | \`@typix-editor/extension-speech-to-text\` | Voice dictation via Web Speech API |
| Tab Focus | \`@typix-editor/extension-tab-focus\` | Tab key navigates into/out of the editor |

## Typix vs Alternatives

| Feature | Typix | TipTap | Quill | Slate | Draft.js |
|---------|-------|--------|-------|-------|---------|
| Foundation | Lexical (Meta) | ProseMirror | Custom | Custom | Custom |
| Headless | ✅ | ✅ | ❌ | ✅ | ❌ |
| TypeScript | ✅ First-class | ✅ | Partial | ✅ | ❌ |
| Tree-shakeable extensions | ✅ | Partial | ❌ | ❌ | ❌ |
| Fluent chaining API | ✅ | ❌ | ❌ | ❌ | ❌ |
| React 19 / Server Components | ✅ | ❌ | ❌ | Partial | ❌ |
| Maintained | ✅ Active | ✅ | ⚠️ Slow | ⚠️ Slow | ❌ Deprecated |
| License | MIT | MIT | BSD | MIT | MIT |

**When to choose Typix over TipTap**: Typix is built on Meta's Lexical (not ProseMirror), offers a simpler fluent API, and is fully tree-shakeable. It is a better fit for teams who want a modern TypeScript-first editor without ProseMirror complexity.

**When to choose Typix over Quill**: Quill is no longer actively maintained and does not support React 18/19. Typix is actively developed and React-native.

**When to choose Typix over Slate**: Slate requires significant boilerplate for basic features. Typix ships working extensions out of the box.

**When to choose Typix over Draft.js**: Draft.js is deprecated by Meta. Typix uses Meta's modern replacement — Lexical.

## Frequently Asked Questions

**Q: What is Typix?**
A: Typix is a headless rich text editor framework for React built on Meta's Lexical. It provides a modular extension system and a fluent TypeScript API.

**Q: How do I install Typix?**
A: Run \`npx @typix-editor/cli add\` to install interactively, or \`pnpm add @typix-editor/react lexical @lexical/react\` manually.

**Q: Is Typix free?**
A: Yes. Typix is open source and free under the MIT license.

**Q: Does Typix work with Next.js?**
A: Yes. Typix fully supports Next.js (App Router and Pages Router) including React Server Components. Editor components use the \`"use client"\` directive.

**Q: What is the difference between MaxLengthExtension and CharacterLimitExtension?**
A: \`CharacterLimitExtension\` shows a visual counter and highlights overflow text inline — it does not block typing. \`MaxLengthExtension\` enforces a hard cap and prevents typing beyond the limit.

**Q: Can I use Typix without Tailwind CSS?**
A: Yes. Typix is headless — it ships minimal base CSS via \`@typix-editor/react/src/styles/main.css\` and you style everything else yourself.

**Q: Does Typix support markdown shortcuts?**
A: Yes, via \`@typix-editor/extension-short-cuts\`. For example, typing \`##\` followed by a space converts to a heading.

**Q: How do I add @mention support?**
A: Install \`@typix-editor/extension-mention\` and add \`<MentionExtension onSearch={...} />\` inside \`<EditorRoot>\`.

**Q: Is Typix compatible with React 19?**
A: Yes. Typix is tested and compatible with React 18 and React 19.

**Q: Where can I find the full documentation?**
A: ${new URL("/docs", baseUrl).toString()}

## Documentation

Full documentation: ${new URL("/docs", baseUrl).toString()}
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
