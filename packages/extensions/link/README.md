# @typix-editor/extension-link

Link node with toggle commands and optional URL validation.

## Installation

```bash
npm install @typix-editor/extension-link
# or
pnpm add @typix-editor/extension-link
```

## Usage

```ts
import { LinkExtension } from "@typix-editor/extension-link"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    LinkExtension({
      validateUrl: (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
    }),
  ],
})

// Toggle a link on the current selection
editor.chain().setLink({ url: "https://example.com" }).run()

// Remove the link
editor.chain().unsetLink().run()
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable link toggle handling |
| `validateUrl` | `(url: string) => boolean` | -- | URL validation function; returning `false` prevents the link |
| `attributes` | `LinkAttributes` | -- | Default HTML attributes applied to all created links |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `setLink` | `{ url: string }` | Apply a link to the current selection |
| `unsetLink` | -- | Remove the link from the current selection |

## API

### Exported Types

- **`LinkConfig`** -- Extension configuration interface.
