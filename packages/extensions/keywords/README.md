# @typix-editor/extension-keywords

Detect and highlight keywords in text. Ships with a built-in list of congratulatory words in 30+ languages; supply your own list to override.

## Installation

```bash
npm install @typix-editor/extension-keywords
# or
pnpm add @typix-editor/extension-keywords
```

## Usage

```ts
import { KeywordsExtension } from "@typix-editor/extension-keywords"
import { createTypix } from "@typix-editor/core"

// Use built-in congratulatory word list
const editor = createTypix({
  extensions: [
    KeywordsExtension(),
  ],
})

// Or supply custom keywords
const editor2 = createTypix({
  extensions: [
    KeywordsExtension({
      keywords: ["URGENT", "TODO", "FIXME"],
      caseSensitive: true,
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable keyword detection |
| `keywords` | `string[]` | Built-in list | Custom keywords to highlight (replaces built-in list) |
| `caseSensitive` | `boolean` | `false` | Case-sensitive matching (only applies with custom keywords) |

## Nodes

- **`KeywordNode`** -- Extends `TextNode`. Renders with CSS class `keyword` and `cursor: default`. Non-editable text entity (cannot insert text before or after).

## API

### Exported Types

- **`KeywordsConfig`** -- Extension configuration interface.

### Constants

- **`KEYWORDS_REGEX`** -- The built-in regex matching congratulatory words in 30+ languages.

### Functions

- **`$createKeywordNode(keyword)`** -- Create a new `KeywordNode`.
- **`$isKeywordNode(node)`** -- Type guard for `KeywordNode`.
