# @typix-editor/extension-code-highlight-prism

Syntax highlighting for code blocks using Prism.

## Installation

```bash
npm install @typix-editor/extension-code-highlight-prism
# or
pnpm add @typix-editor/extension-code-highlight-prism
```

## Usage

```ts
import { CodeBlockExtension } from "@typix-editor/extension-code-block"
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    CodeBlockExtension(),
    CodeHighlightPrismExtension({
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
| `CodeHighlightPrismExtension` | Function | Extension factory |
| `CodeHighlightPrismConfig` | Type | Configuration interface |
