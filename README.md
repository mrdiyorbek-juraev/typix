# Typix

**A headless, extensible rich text editor framework for React, built on Meta's [Lexical](https://lexical.dev).**

[![npm version](https://img.shields.io/npm/v/@typix-editor/react)](https://www.npmjs.com/package/@typix-editor/react)
[![npm downloads](https://img.shields.io/npm/dm/@typix-editor/react)](https://www.npmjs.com/package/@typix-editor/react)
[![license](https://img.shields.io/github/license/mrdiyorbek-juraev/typix)](https://github.com/mrdiyorbek-juraev/typix/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue)](https://typix.uz/docs)

**[Documentation](https://typix.uz/docs) · [Examples](https://typix.uz/examples) · [npm](https://www.npmjs.com/package/@typix-editor/react)**

---

## What is Typix?

Typix wraps Lexical with opinionated abstractions, a fluent editor API, and a modular extension system. Install only the extensions you need — no bloat, no forced UI, full control over rendering.

```tsx
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
```

## Why Typix?

| | Typix | TipTap | Quill | Slate | Draft.js |
|---|---|---|---|---|---|
| Foundation | Lexical (Meta) | ProseMirror | Custom | Custom | Custom |
| Headless | ✅ | ✅ | ❌ | ✅ | ❌ |
| TypeScript first | ✅ | ✅ | Partial | ✅ | ❌ |
| Tree-shakeable extensions | ✅ | Partial | ❌ | ❌ | ❌ |
| Fluent chaining API | ✅ | ❌ | ❌ | ❌ | ❌ |
| React 18/19 support | ✅ | ❌ | ❌ | Partial | ❌ |
| Maintained | ✅ Active | ✅ | ⚠️ Slow | ⚠️ Slow | ❌ Deprecated |

## Installation

```bash
# Recommended — interactive CLI
npx @typix-editor/cli add

# Manual
pnpm add @typix-editor/react lexical @lexical/react
```

## Extensions

Install only what you need. Each extension is a separate package.

| Extension | Package | Description |
|-----------|---------|-------------|
| Auto Complete | [`@typix-editor/extension-auto-complete`](packages/extensions/auto-complete) | Inline word suggestions while typing |
| Auto Link | [`@typix-editor/extension-auto-link`](packages/extensions/auto-link) | Auto-converts URLs and emails to links |
| Character Limit | [`@typix-editor/extension-character-limit`](packages/extensions/character-limit) | Visual counter with overflow highlighting |
| Code Highlight (Prism) | [`@typix-editor/extension-code-highlight-prism`](packages/extensions/code-highlight-prism) | Syntax highlighting via Prism.js |
| Code Highlight (Shiki) | [`@typix-editor/extension-code-highlight-shiki`](packages/extensions/code-highlight-shiki) | Syntax highlighting via Shiki |
| Collapsible | [`@typix-editor/extension-collapsible`](packages/extensions/collapsible) | Expandable/collapsible content blocks |
| Context Menu | [`@typix-editor/extension-context-menu`](packages/extensions/context-menu) | Custom right-click context menu |
| Drag & Drop Paste | [`@typix-editor/extension-drag-drop-paste`](packages/extensions/drag-drop-paste) | Drag-and-drop or paste file uploads |
| Draggable Block | [`@typix-editor/extension-draggable-block`](packages/extensions/draggable-block) | Drag handle to reorder content blocks |
| Floating Link | [`@typix-editor/extension-floating-link`](packages/extensions/floating-link) | Floating toolbar for inserting/editing links |
| Keywords | [`@typix-editor/extension-keywords`](packages/extensions/keywords) | Highlight specific keywords inline |
| Link | [`@typix-editor/extension-link`](packages/extensions/link) | Basic link node and URL validation |
| Max Length | [`@typix-editor/extension-max-length`](packages/extensions/max-length) | Hard character cap — blocks input at limit |
| Mention | [`@typix-editor/extension-mention`](packages/extensions/mention) | @mention with custom suggestion dropdown |
| Keyboard Shortcuts | [`@typix-editor/extension-short-cuts`](packages/extensions/short-cuts) | Markdown-style shortcuts (## → heading) |
| Speech to Text | [`@typix-editor/extension-speech-to-text`](packages/extensions/speech-to-text) | Voice dictation via Web Speech API |
| Tab Focus | [`@typix-editor/extension-tab-focus`](packages/extensions/tab-focus) | Tab key navigates into/out of the editor |

## Repository Structure

```
typix/
├── packages/
│   ├── react/               # @typix-editor/react — core React integration
│   ├── extensions/          # One package per extension
│   └── cli/                 # @typix-editor/cli — interactive installer
└── apps/
    └── typix/               # Documentation site (typix.uz)
```

## Contributing

PRs and issues welcome. See [CLAUDE.md](CLAUDE.md) for development setup and conventions.

## License

MIT © [Diyorbek Juraev](https://github.com/mrdiyorbek-juraev)
