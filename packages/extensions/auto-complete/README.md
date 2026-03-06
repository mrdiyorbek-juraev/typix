# @typix-editor/extension-auto-complete

Inline text autocomplete suggestions with Tab or swipe-right to accept.

## Installation

```bash
npm install @typix-editor/extension-auto-complete
# or
pnpm add @typix-editor/extension-auto-complete
```

## Usage

```ts
import { AutocompleteExtension } from "@typix-editor/extension-auto-complete"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    AutocompleteExtension({
      minSearchLength: 3,
      onAccept: (word) => console.log("Accepted:", word),
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable autocomplete |
| `dictionary` | `string[]` | built-in | Custom word list (replaces built-in dictionary) |
| `minSearchLength` | `number` | `4` | Minimum characters before a search runs |
| `queryLatencyMs` | `number` | `200` | Debounce delay (ms) before querying the dictionary |
| `onAccept` | `(word: string) => void` | - | Called when the user accepts a suggestion |

## Nodes

| Node | Description |
|------|-------------|
| `AutocompleteNode` | Inline ghost-text node that renders the suggestion |

## API

| Export | Type | Description |
|--------|------|-------------|
| `AutocompleteExtension` | Function | Extension factory |
| `AutocompleteConfig` | Type | Configuration interface |
| `AutocompleteNode` | Class | Lexical node for autocomplete text |
