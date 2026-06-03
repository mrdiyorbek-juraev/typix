# @typix-editor/extension-draggable-block

Headless block reordering via drag-and-drop. Provides the extension config and class name contracts for framework-specific drag handle UI.

## Installation

```bash
npm install @typix-editor/extension-draggable-block
# or
pnpm add @typix-editor/extension-draggable-block
```

## Usage

```ts
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    DraggableBlockExtension(),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable draggable block behavior |

## API

### Exported Types

- **`DraggableBlockConfig`** -- Extension configuration interface.
- **`DraggableBlockClassNames`** -- CSS class name overrides for the drag UI:

```ts
interface DraggableBlockClassNames {
  /** @default 'typix-draggable-menu' */
  menu?: string;
  /** @default 'typix-draggable__target-line' */
  targetLine?: string;
  /** @default 'typix-draggable-menu__icon' */
  icon?: string;
}
```
