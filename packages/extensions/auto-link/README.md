# @typix-editor/extension-auto-link

Automatically converts URLs and email addresses into clickable links as users type.

## Installation

```bash
npm install @typix-editor/extension-auto-link
```

## Usage

```tsx
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <AutoLinkExtension />
</EditorRoot>
```

### Custom Matchers

```tsx
const EMAIL_MATCHER = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/;

<AutoLinkExtension
  matchers={[
    { pattern: EMAIL_MATCHER, type: "email" },
  ]}
  onChange={(url, prevUrl) => console.log("Link changed:", url)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `matchers` | `LinkMatcher[]` | URL + email matchers | Custom regex matchers for auto-linking |
| `onChange` | `(url: string \| null, prevUrl: string \| null) => void` | - | Callback when a link is created or removed |

## Documentation

[typix.com/docs/extensions/auto-link](https://typix.com/docs/extensions/auto-link)

## License

MIT
