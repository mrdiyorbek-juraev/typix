# @typix-editor/extension-markdown-shortcuts

Type Markdown syntax to auto-format text into rich content as you type.

## Installation

```bash
npm install @typix-editor/extension-markdown-shortcuts
# or
pnpm add @typix-editor/extension-markdown-shortcuts
```

## Usage

```ts
import { MarkdownShortcutsExtension } from "@typix-editor/extension-markdown-shortcuts"
import { createTypix } from "@typix-editor/core"

// All built-in transformers (default)
const editor = createTypix({
  extensions: [
    MarkdownShortcutsExtension(),
  ],
})

// Only specific transformers
import { HEADING, BOLD_STAR, ITALIC_STAR } from "@typix-editor/extension-markdown-shortcuts"

const editor2 = createTypix({
  extensions: [
    MarkdownShortcutsExtension({
      transformers: [HEADING, BOLD_STAR, ITALIC_STAR],
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable all markdown shortcuts |
| `transformers` | `Transformer[]` | `TRANSFORMERS` (all built-in) | Markdown transformers to register |

## Shortcuts

| Syntax | Result |
|--------|--------|
| `# ` | Heading 1 |
| `## ` | Heading 2 |
| `### ` | Heading 3 |
| `> ` | Blockquote |
| `` ``` `` | Code block |
| `**text**` | **Bold** |
| `*text*` | *Italic* |
| `~~text~~` | ~~Strikethrough~~ |
| `` `code` `` | Inline code |
| `- ` or `* ` | Bullet list |
| `1. ` | Ordered list |
| `- [ ] ` | Checkbox |

## API

### Exported Types

- **`MarkdownShortcutsConfig`** -- Extension configuration interface.
- **`Transformer`** -- Base transformer type.
- **`ElementTransformer`** -- Block-level transformer type.
- **`TextFormatTransformer`** -- Inline format transformer type.
- **`TextMatchTransformer`** -- Text match transformer type.

### Re-exported Transformers

Individual transformers for selective use:

`HEADING`, `QUOTE`, `CODE`, `UNORDERED_LIST`, `ORDERED_LIST`, `CHECK_LIST`, `BOLD_STAR`, `BOLD_UNDERSCORE`, `ITALIC_STAR`, `ITALIC_UNDERSCORE`, `BOLD_ITALIC_STAR`, `BOLD_ITALIC_UNDERSCORE`, `STRIKETHROUGH`, `INLINE_CODE`, `HIGHLIGHT`, `LINK`

### Transformer Collections

- **`TRANSFORMERS`** -- All built-in transformers.
- **`ELEMENT_TRANSFORMERS`** -- Block-level transformers only.
- **`TEXT_FORMAT_TRANSFORMERS`** -- Inline format transformers only.
- **`TEXT_MATCH_TRANSFORMERS`** -- Text match transformers only.
- **`MULTILINE_ELEMENT_TRANSFORMERS`** -- Multiline element transformers only.
