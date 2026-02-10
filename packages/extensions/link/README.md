# @typix-editor/extension-link

Link extension for Typix editors. Wraps Lexical's LinkPlugin with optional custom URL validation.

## Installation

```bash
npm install @typix-editor/extension-link
```

## Usage

```tsx
import { LinkExtension } from "@typix-editor/extension-link";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <LinkExtension />
</EditorRoot>
```

### Custom URL Validation

```tsx
<LinkExtension validateUrl={(url) => {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `validateUrl` | `(url: string) => boolean` | Typix's built-in `validateUrl` | Custom URL validation function |

## Documentation

[typix.com/docs/extensions/link](https://typix.com/docs/extensions/link)

## License

MIT
