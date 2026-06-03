# @typix-editor/extension-image

Image insertion with alignment, captions, resize support, and a headless decorator node.

## Installation

```bash
npm install @typix-editor/extension-image
# or
pnpm add @typix-editor/extension-image
```

## Usage

```ts
import { ImageExtension } from "@typix-editor/extension-image"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    ImageExtension({
      maxWidth: 800,
      component: (data) => {
        // Return a framework-specific element (JSX, Vue VNode, etc.)
      },
      onInsert: (payload) => console.log("Image inserted:", payload.src),
      onDelete: (src) => console.log("Image deleted:", src),
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable image handling |
| `maxWidth` | `number` | `800` | Default maximum width in pixels for inserted images |
| `component` | `(data: ImageDecoratorData) => unknown` | -- | Render function for the image decorator node |
| `onInsert` | `(payload: InsertImagePayload) => void` | -- | Callback after an image is inserted |
| `onDelete` | `(src: string) => void` | -- | Callback when an image is removed (for cleanup) |
| `allowedTypes` | `string[]` | -- | Allowed MIME types for images (e.g., `['image/png', 'image/jpeg']`) |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `insertImage` | `InsertImagePayload` | Insert an image node at the current selection |
| `setImageAlignment` | `{ nodeKey: string, alignment: ImageAlignment }` | Set alignment for an image node |
| `toggleImageCaption` | `{ nodeKey: string }` | Toggle caption visibility on an image |
| `deleteImage` | `{ nodeKey: string }` | Remove an image node and trigger `onDelete` |
| `duplicateImage` | `{ nodeKey: string }` | Clone an image node and insert after the original |

## Nodes

- **`ImageNode`** -- Decorator node that stores image data (src, alt, dimensions, alignment, caption). Handles JSON/DOM serialization. Calls the registered `component` renderer via a per-editor WeakMap.

## API

### Exported Types

- **`ImageConfig`** -- Extension configuration interface.
- **`SerializedImageNode`** -- JSON serialization shape.
- **`ImageAlignment`** -- `"left" | "center" | "right" | "full-width"`
- **`ImageDecoratorData`** -- Data passed to the `component` renderer:

```ts
interface ImageDecoratorData {
  nodeKey: string;
  src: string;
  altText: string;
  width: number | "inherit";
  height: number | "inherit";
  maxWidth: number;
  showCaption: boolean;
  caption: string;
  alignment: ImageAlignment;
}
```

### Functions

- **`$createImageNode(opts)`** -- Create a new `ImageNode`.
- **`$isImageNode(node)`** -- Type guard for `ImageNode`.

### Re-exports

- `INSERT_IMAGE_COMMAND`, `InsertImagePayload` from `@typix-editor/extension-drag-drop-paste`.
