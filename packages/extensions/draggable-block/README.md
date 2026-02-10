# @typix-editor/extension-draggable-block

Drag-and-drop block reordering for Typix editors. Adds a drag handle to top-level blocks.

## Installation

```bash
npm install @typix-editor/extension-draggable-block
```

## Usage

```tsx
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <DraggableBlockExtension />
</EditorRoot>
```

### Custom Drag Handle

```tsx
import { GripVertical } from "lucide-react";

<DraggableBlockExtension
  dragHandleIcon={<GripVertical size={16} />}
  classNames={{
    wrapper: "my-drag-wrapper",
    handle: "my-drag-handle",
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dragHandleIcon` | `React.ReactNode` | Default grip icon | Custom drag handle icon |
| `classNames` | `DraggableBlockClassNames` | - | Custom CSS classes for wrapper and handle |

## Documentation

[typix.com/docs/extensions/draggable-block](https://typix.com/docs/extensions/draggable-block)

## License

MIT
