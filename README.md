
# Typix

**A headless, extensible rich text editor framework for React, built on Meta's [Lexical](https://lexical.dev).**

[![npm version](https://img.shields.io/npm/v/@typix-editor/react)](https://www.npmjs.com/package/@typix-editor/react)
[![npm downloads](https://img.shields.io/npm/dm/@typix-editor/react)](https://www.npmjs.com/package/@typix-editor/react)
[![license](https://img.shields.io/github/license/mrdiyorbek-juraev/typix)](https://github.com/mrdiyorbek-juraev/typix/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue)](https://typix.uz/docs)

**[Documentation](https://typix.uz/docs) · [Examples](https://typix.uz/examples) · [npm](https://www.npmjs.com/package/@typix-editor/react)**

![banner](./apps/typix/public/banner.png)
---

## What is Typix?

Typix wraps Lexical with opinionated abstractions, a hook-based editor API, and a modular extension system. Install only the extensions you need — no bloat, no forced UI, full control over rendering.

```tsx
"use client";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";

const extensions = [StarterKit()];

export default function Editor() {
  const editor = useTypixEditor({
    extensions,
    namespace: "my-editor",
    theme: defaultTheme,
    immediatelyRender: false, // SSR-safe (Next.js App Router)
  });

  if (!editor) return null;

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent
        editor={editor}
        placeholder="Start typing..."
        className="prose max-w-none"
      />
    </TypixEditorContext.Provider>
  );
}
```

Add to your CSS entry (`globals.css` or similar):

```css
@import "tailwindcss";
@import "@typix-editor/ui/styles";
```

## Installation

```bash
# 1. Install the editor + an extension
pnpm add @typix-editor/react @typix-editor/extension-starter-kit \
  lexical @lexical/react

# 2. Optional — scaffold a typix.json so you can use the CLI
npx @typix-editor/cli init

# 3. Optional — vendor design-system UI components (shadcn-style)
#    Copies source into ./components/typix/ — you own and customize the code.
npx @typix-editor/cli ui add floating-link mention table
```

> **Two CLI surfaces:**
> - `typix add <extension>` installs editor extensions as npm packages.
> - `typix ui add <component>` vendors UI components (toolbars, menus, code-block UI) into your project — you own the files.

## Extensions

Install only what you need. Each extension is a separate package — install with `pnpm add @typix-editor/extension-<name>` or `npx typix add <name>`.

| Extension | Package | Description |
|-----------|---------|-------------|
| Starter Kit | [`@typix-editor/extension-starter-kit`](packages/extensions/starter-kit) | Bundled defaults: rich text, history, lists, headings, etc. |
| Auto Complete | [`@typix-editor/extension-auto-complete`](packages/extensions/auto-complete) | Inline word suggestions while typing |
| Auto Link | [`@typix-editor/extension-auto-link`](packages/extensions/auto-link) | Auto-converts URLs and emails to links |
| Character Limit | [`@typix-editor/extension-character-limit`](packages/extensions/character-limit) | Visual counter with overflow highlighting |
| Code Block | [`@typix-editor/extension-code-block`](packages/extensions/code-block) | Multi-line code blocks with language selection |
| Code Block (Prettier) | [`@typix-editor/extension-code-block-prettier`](packages/extensions/code-block-prettier) | Prettier-format code blocks on demand |
| Code Highlight (Prism) | [`@typix-editor/extension-code-highlight-prism`](packages/extensions/code-highlight-prism) | Syntax highlighting via Prism.js |
| Code Highlight (Shiki) | [`@typix-editor/extension-code-highlight-shiki`](packages/extensions/code-highlight-shiki) | Syntax highlighting via Shiki |
| Collapsible | [`@typix-editor/extension-collapsible`](packages/extensions/collapsible) | Expandable/collapsible content blocks |
| Context Menu | [`@typix-editor/extension-context-menu`](packages/extensions/context-menu) | Custom right-click context menu |
| Drag & Drop Paste | [`@typix-editor/extension-drag-drop-paste`](packages/extensions/drag-drop-paste) | Drag-and-drop or paste file uploads |
| Draggable Block | [`@typix-editor/extension-draggable-block`](packages/extensions/draggable-block) | Drag handle to reorder content blocks |
| Floating Link | [`@typix-editor/extension-floating-link`](packages/extensions/floating-link) | Floating toolbar for inserting/editing links |
| Image | [`@typix-editor/extension-image`](packages/extensions/image) | Block image with resize, alignment, caption, alt text |
| Keywords | [`@typix-editor/extension-keywords`](packages/extensions/keywords) | Highlight specific keywords inline |
| Link | [`@typix-editor/extension-link`](packages/extensions/link) | Basic link node and URL validation |
| Markdown Shortcuts | [`@typix-editor/extension-markdown-shortcuts`](packages/extensions/markdown-shortcuts) | Convert markdown syntax to formatting as you type |
| Max Length | [`@typix-editor/extension-max-length`](packages/extensions/max-length) | Hard character cap — blocks input at limit |
| Mention | [`@typix-editor/extension-mention`](packages/extensions/mention) | @mention with custom suggestion dropdown |
| Keyboard Shortcuts | [`@typix-editor/extension-short-cuts`](packages/extensions/short-cuts) | Markdown-style shortcuts (## → heading) |
| Slash Command | [`@typix-editor/extension-slash-command`](packages/extensions/slash-command) | Notion-style `/` command menu for inserting blocks |
| Speech to Text | [`@typix-editor/extension-speech-to-text`](packages/extensions/speech-to-text) | Voice dictation via Web Speech API |
| Tab Focus | [`@typix-editor/extension-tab-focus`](packages/extensions/tab-focus) | Tab key navigates into/out of the editor |
| Table | [`@typix-editor/extension-table`](packages/extensions/table) | Tables with rows, columns, resize, cell merging |
| Tailwind | [`@typix-editor/extension-tailwind`](packages/extensions/tailwind) | Tailwind-friendly theme tokens for editor nodes |

## UI Components

The `@typix-editor/ui` package ships **28 headless primitives** (button, popover, dropdown, etc.) and **23 main editor components** (toolbars, floating link UI, mention menu, code-block UI, table UI, etc.). Components are designed to be **vendored into your project** via the CLI — you own the source, customize anything.

```bash
# List everything available
npx typix ui list

# Vendor specific components (copies source into ./components/typix/)
npx typix ui add floating-link mention code-block

# Or grab everything at once
npx typix ui add --all
```

The CLI walks each component's dependency graph and copies primitives + shared lib files alongside. Re-run with `--overwrite` to refresh from upstream after upgrading the CLI.

## Repository Structure

```
typix/
├── packages/
│   ├── core/                # @typix-editor/core — headless engine, framework-agnostic
│   ├── react/               # @typix-editor/react — React adapter (hooks, components)
│   ├── design-system/       # @typix-editor/ui — primitives + main editor UI (private; shipped via CLI)
│   ├── extensions/          # One package per editor extension (25 packages)
│   ├── cli/                 # @typix-editor/cli — typix CLI (add, ui add, init, list, …)
│   └── utils/               # @typix-editor/utils — shared helpers
└── apps/
    ├── playground/          # Dev playground (Next.js)
    ├── storybook/           # Storybook for @typix-editor/ui
    └── typix/               # Documentation site (typix.uz)
```

## Contributing

PRs and issues welcome. See [CLAUDE.md](CLAUDE.md) for development setup and conventions.

## License

MIT © [Diyorbek Juraev](https://github.com/mrdiyorbek-juraev)
