# @typix-editor/extension-code-block-prettier

Format code blocks with Prettier. Async formatting with reactive loading and error state.

## Installation

```bash
npm install @typix-editor/extension-code-block-prettier
# or
pnpm add @typix-editor/extension-code-block-prettier
```

**Peer dependency:** requires `prettier` (v3+) to be installed.

## Usage

```ts
import { CodeBlockExtension } from "@typix-editor/extension-code-block"
import { PrettierFormatterExtension } from "@typix-editor/extension-code-block-prettier"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    CodeBlockExtension(),
    PrettierFormatterExtension({
      printOptions: { tabWidth: 2, singleQuote: true },
      onFormat: (formatted, nodeKey) => console.log("Formatted", nodeKey),
    }),
  ],
})

// Format a code block
editor.chain().formatWithPrettier({ nodeKey: "abc" }).run()
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `printOptions` | `Record<string, unknown>` | `{}` | Prettier printer options forwarded to every `format()` call |
| `onFormat` | `(formatted: string, nodeKey: string) => void` | - | Called after formatting succeeds |
| `onError` | `(err: unknown, nodeKey: string) => void` | - | Called when formatting fails (e.g. syntax error) |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `formatWithPrettier` | `{ nodeKey: string }` | Format the specified code block with Prettier |

## Supported Languages

`javascript`, `js`, `jsx`, `typescript`, `ts`, `tsx`, `css`, `scss`, `less`, `html`, `markdown`, `json`, `graphql`

## API

| Export | Type | Description |
|--------|------|-------------|
| `PrettierFormatterExtension` | Function | Extension factory |
| `PrettierFormatterConfig` | Type | Configuration interface |
| `PrettierOutput` | Type | Runtime output interface |
| `getPrettierOutput` | Function | Retrieve reactive output for a given editor |
| `canFormatWithPrettier` | Function | Check if a language is supported by Prettier |

### Output Signals

Access via `getPrettierOutput(editor.lexical)`:

| Signal | Type | Description |
|--------|------|-------------|
| `formatting` | `Signal<Set<string>>` | Set of node keys currently being formatted |
| `errors` | `Signal<Map<string, string>>` | Per-node error message from the last failed format |
