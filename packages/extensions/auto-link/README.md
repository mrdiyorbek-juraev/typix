# @typix-editor/extension-auto-link

Automatically detects URLs and email addresses and converts them to links.

## Installation

```bash
npm install @typix-editor/extension-auto-link
# or
pnpm add @typix-editor/extension-auto-link
```

## Usage

```ts
import { AutoLinkExtension } from "@typix-editor/extension-auto-link"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    AutoLinkExtension({
      defaultAttributes: { target: "_blank", rel: "noopener noreferrer" },
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable auto-link detection |
| `matchers` | `LinkMatcher[]` | `MATCHERS` | Array of matcher functions for link detection |
| `onChange` | `ChangeHandler` | - | Called when auto-links are created or removed |
| `defaultAttributes` | `{ rel?: string; target?: string }` | - | Default HTML attributes applied to every auto-detected link |

## API

| Export | Type | Description |
|--------|------|-------------|
| `AutoLinkExtension` | Function | Extension factory |
| `AutoLinkConfig` | Type | Configuration interface |
| `MATCHERS` | `LinkMatcher[]` | Built-in URL and email matchers |
| `LinkMatcher` | Type | Matcher function signature |
| `ChangeHandler` | Type | onChange callback signature |
| `createLinkMatcherWithRegExp` | Function | Helper to create a `LinkMatcher` from a RegExp |
| `URL_REGEX` | `RegExp` | Built-in URL detection pattern |
| `EMAIL_REGEX` | `RegExp` | Built-in email detection pattern |
