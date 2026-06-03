# @typix-editor/extension-code-highlight-shiki

Syntax highlighting for code blocks using Shiki.

## Installation

```bash
npm install @typix-editor/extension-code-highlight-shiki
# or
pnpm add @typix-editor/extension-code-highlight-shiki
```

## Usage

```ts
import { CodeBlockExtension } from "@typix-editor/extension-code-block"
import { CodeHighlightShikiExtension } from "@typix-editor/extension-code-highlight-shiki"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    CodeBlockExtension(),
    CodeHighlightShikiExtension({
      defaultLanguage: "typescript",
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable syntax highlighting |
| `defaultLanguage` | `string` | - | Default language for new code blocks |

## API

| Export | Type | Description |
|--------|------|-------------|
| `CodeHighlightShikiExtension` | Function | Extension factory |
| `CodeHighlightShikiConfig` | Type | Configuration interface |
