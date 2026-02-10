# @typix-editor/extension-floating-link

Floating link editor toolbar for Typix editors. Shows an inline UI for editing link URLs when a link is selected.

## Installation

```bash
npm install @typix-editor/extension-floating-link
```

## Usage

```tsx
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <FloatingLinkExtension />
</EditorRoot>
```

### Custom Render

```tsx
<FloatingLinkExtension verticalOffset={10}>
  {({ isEditing, url, setUrl, saveLink, cancelEdit, editLink, removeLink }) => (
    <div className="my-link-editor">
      {isEditing ? (
        <>
          <input value={url} onChange={(e) => setUrl(e.target.value)} />
          <button onClick={saveLink}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <a href={url}>{url}</a>
          <button onClick={editLink}>Edit</button>
          <button onClick={removeLink}>Remove</button>
        </>
      )}
    </div>
  )}
</FloatingLinkExtension>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `(props: FloatingLinkRenderProps) => ReactNode` | Built-in UI | Custom render function |
| `verticalOffset` | `number` | `0` | Vertical offset for positioning |

## Documentation

[typix.com/docs/extensions/floating-link](https://typix.com/docs/extensions/floating-link)

## License

MIT
