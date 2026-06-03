# @typix-editor/extension-drag-drop-paste

Handle file uploads via drag-and-drop and paste with validation, size limits, and custom processing.

## Installation

```bash
npm install @typix-editor/extension-drag-drop-paste
# or
pnpm add @typix-editor/extension-drag-drop-paste
```

## Usage

```ts
import { DragDropPasteExtension } from "@typix-editor/extension-drag-drop-paste"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    DragDropPasteExtension({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      onFilesAdded: async (files) => {
        // Upload files and return image payloads
        return files.map((file) => ({
          src: URL.createObjectURL(file),
          altText: file.name,
        }))
      },
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable drag-drop-paste handling |
| `acceptedTypes` | `string[]` | Common image MIME types | Accepted file MIME types |
| `maxFileSize` | `number` | `10485760` (10MB) | Maximum file size in bytes |
| `priority` | `CommandListenerPriority` | `COMMAND_PRIORITY_LOW` | Lexical command listener priority |
| `onFilesAdded` | `(files: File[]) => Promise<InsertImagePayload[]>` | Base64 reader | Custom handler for processing dropped/pasted files |
| `onValidationError` | `(file: File, reason: string) => void` | -- | Callback when a file fails validation |
| `transformResult` | `(file: File, result: string) => InsertImagePayload` | `{ src, altText }` | Transform the default base64 result into a custom payload |
| `debug` | `boolean` | `false` | Log processing steps to console |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `INSERT_IMAGE_COMMAND` | `InsertImagePayload` | Dispatched for each valid file after processing |

## API

### Exported Types

- **`DragDropPasteConfig`** -- Extension configuration interface.
- **`InsertImagePayload`** -- Payload shape for `INSERT_IMAGE_COMMAND`:

```ts
interface InsertImagePayload {
  src: string;
  altText?: string;
  width?: number | "inherit";
  height?: number | "inherit";
  maxWidth?: number;
  showCaption?: boolean;
  caption?: string;
  key?: string;
}
```
