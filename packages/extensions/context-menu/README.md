# @typix-editor/extension-context-menu

Headless right-click context menu hook for framework-specific rendering.

## Installation

```bash
npm install @typix-editor/extension-context-menu
# or
pnpm add @typix-editor/extension-context-menu
```

## Usage

```ts
import { ContextMenuExtension } from "@typix-editor/extension-context-menu"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    ContextMenuExtension(),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable context menu handling |

## API

### Exported Types

- **`ContextMenuConfig`** -- Extension configuration interface.
- **`TypixContextMenuItem`** -- Discriminated union describing a menu item or separator.

### `TypixContextMenuItem`

Each item is either an action item or a visual separator:

```ts
// Action item
{
  type: "item";
  label: string;
  icon?: unknown;
  disabled?: boolean;
  showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
  onSelect: (editor: TypixEditor) => void;
}

// Separator
{
  type: "separator";
  showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
}
```

Use `showOn` to conditionally display items based on the right-clicked node.
