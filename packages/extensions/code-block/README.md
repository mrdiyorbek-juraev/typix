# @typix-editor/extension-code-block

Code block insertion and management with language selection, copy-to-clipboard, and reactive node tracking.

## Installation

```bash
npm install @typix-editor/extension-code-block
# or
pnpm add @typix-editor/extension-code-block
```

## Usage

```ts
import { CodeBlockExtension } from "@typix-editor/extension-code-block"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    CodeBlockExtension({
      defaultLanguage: "typescript",
      languages: ["javascript", "typescript", "python", "css"],
      onCopy: (code) => toast("Copied!"),
    }),
  ],
})

// Insert a code block
editor.chain().insertCodeBlock({ language: "python" }).run()

// Change language
editor.chain().setCodeLanguage({ nodeKey: "abc", language: "typescript" }).run()

// Copy code to clipboard
editor.chain().copyCode({ nodeKey: "abc" }).run()
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable all code-block commands and mutation tracking |
| `defaultLanguage` | `string` | `"javascript"` | Language applied when inserting without explicit language |
| `languages` | `string[]` | all Prism languages | Restrict available languages to a specific list |
| `onCopy` | `(code: string, nodeKey: string) => void` | - | Called after code is copied to clipboard |
| `onLanguageChange` | `(language: string, nodeKey: string) => void` | - | Called when a code block's language changes |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `insertCodeBlock` | `{ language?: string }` | Insert a code block (toggles back to paragraph if already in one) |
| `setCodeLanguage` | `{ nodeKey: string; language: string }` | Change a code block's language |
| `copyCode` | `{ nodeKey: string }` | Copy code content to clipboard |
| `deleteCodeBlock` | `{ nodeKey: string }` | Remove a code block from the editor |

**Keyboard shortcut:** `Mod+Alt+\`` inserts a code block.

## Nodes

| Node | Description |
|------|-------------|
| `CodeNode` | Block-level code container |
| `CodeHighlightNode` | Inline token node for syntax-highlighted spans |

## API

| Export | Type | Description |
|--------|------|-------------|
| `CodeBlockExtension` | Function | Extension factory |
| `CodeBlockConfig` | Type | Configuration interface |
| `CodeBlockOutput` | Type | Runtime output interface (`nodeKeys` signal) |
| `getCodeBlockOutput` | Function | Retrieve reactive output for a given editor |
| `LANGUAGE_MAP` | `Record<string, string>` | Language key to display name map |
| `LANGUAGE_KEYS` | `string[]` | Sorted array of all supported language keys |
| `getLanguageDisplayName` | Function | Get human-readable name for a language key |
| `normalizeLanguage` | Function | Normalize aliases (e.g. `"js"` to `"javascript"`) |
| `searchLanguages` | Function | Filter language entries by query string |
