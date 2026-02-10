# @typix-editor/extension-drag-drop-paste

Handle image drag-and-drop and paste events in Typix editors. Supports file validation, custom upload handlers, and base64 conversion.

## Installation

```bash
npm install @typix-editor/extension-drag-drop-paste
```

## Usage

```tsx
import { DragDropPasteExtension } from "@typix-editor/extension-drag-drop-paste";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <DragDropPasteExtension
    acceptedTypes={["image/png", "image/jpeg", "image/gif"]}
    maxFileSize={5 * 1024 * 1024}
    onFilesAdded={async (files) => {
      // Upload files and return image payloads
      return files.map((file) => ({
        src: URL.createObjectURL(file),
        altText: file.name,
      }));
    }}
  />
</EditorRoot>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `acceptedTypes` | `string[]` | All images | MIME types to accept |
| `maxFileSize` | `number` | - | Max file size in bytes |
| `onFilesAdded` | `(files: File[]) => Promise<InsertImagePayload[]>` | Base64 conversion | Custom upload handler |
| `onValidationError` | `(file: File, reason: string) => void` | - | Validation error callback |
| `debug` | `boolean` | `false` | Enable debug logging |

## Documentation

[typix.com/docs/extensions/drag-drop-paste](https://typix.com/docs/extensions/drag-drop-paste)

## License

MIT
