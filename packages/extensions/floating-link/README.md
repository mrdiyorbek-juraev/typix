# @typix-editor/extension-floating-link

Detect link selection and provide reactive signals for building a floating link toolbar.

## Installation

```bash
npm install @typix-editor/extension-floating-link
# or
pnpm add @typix-editor/extension-floating-link
```

## Usage

```ts
import { FloatingLinkExtension, getFloatingLinkOutput } from "@typix-editor/extension-floating-link"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    FloatingLinkExtension({ openInNewTab: true }),
  ],
})

// Read output signals in your framework component
const output = getFloatingLinkOutput(editor.unwrap())
// output.isLink.value   -- true when caret is inside a link
// output.activeEditor   -- the (possibly nested) editor owning the selection
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable floating link detection |
| `openInNewTab` | `boolean` | `true` | Open links in a new tab on Ctrl/Cmd+click |

## Output Signals

| Signal | Type | Description |
|--------|------|-------------|
| `disabled` | `Signal<boolean>` | Reactive mirror of the `disabled` config |
| `isLink` | `Signal<boolean>` | `true` when the current selection is inside a link node |
| `activeEditor` | `Signal<LexicalEditor>` | The active editor instance owning the current selection |

Access signals via `getFloatingLinkOutput(lexicalEditor)`.

## API

### Exported Types

- **`FloatingLinkConfig`** -- Extension configuration interface.
- **`FloatingLinkOutput`** -- Output signals interface.

### Functions

- **`getFloatingLinkOutput(editor: LexicalEditor)`** -- Returns the output signals for the given editor, or `undefined` if the extension is not registered on that editor.
