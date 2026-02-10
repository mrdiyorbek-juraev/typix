# @typix-editor/extension-short-cuts

Keyboard shortcuts for text formatting in Typix editors. Includes bold, italic, strikethrough, lists, headings, alignment, font size, and more.

## Installation

```bash
npm install @typix-editor/extension-short-cuts
```

## Usage

```tsx
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <ShortCutsExtension />
</EditorRoot>
```

### With Link Edit Callback

```tsx
<ShortCutsExtension
  onLinkEditModeChange={(isEditing) => {
    console.log("Link edit mode:", isEditing);
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLinkEditModeChange` | `(isLinkEditMode: boolean) => void` | - | Callback when link editing mode changes |

## Included Shortcuts

Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Indent/Outdent, Left/Center/Right/Justify alignment, Numbered/Bullet list, Heading levels, Increase/Decrease font size, Insert link, and more.

Access the full list via the `SHORTCUTS` export.

## Documentation

[typix.com/docs/extensions/short-cuts](https://typix.com/docs/extensions/short-cuts)

## License

MIT
