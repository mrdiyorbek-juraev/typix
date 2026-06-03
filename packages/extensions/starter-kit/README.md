# @typix-editor/extension-starter-kit

Curated bundle of essential extensions with preset configurations for quick setup.

## Installation

```bash
npm install @typix-editor/extension-starter-kit
# or
pnpm add @typix-editor/extension-starter-kit
```

## Usage

```ts
import { StarterKit } from "@typix-editor/extension-starter-kit"
import { createTypix } from "@typix-editor/core"

// Full preset (default) — all 19 extensions enabled
const editor = createTypix({
  extensions: [StarterKit()],
})

// Blog preset — common formatting for blog posts
const editor = createTypix({
  extensions: [StarterKit({ preset: "blog" })],
})

// Minimal preset — just bold, italic, headings (h1–h3), and history
const editor = createTypix({
  extensions: [StarterKit({ preset: "minimal" })],
})

// Disable specific extensions
const editor = createTypix({
  extensions: [
    StarterKit({
      strike: false,
      subscript: false,
    }),
  ],
})

// Configure individual extensions
const editor = createTypix({
  extensions: [
    StarterKit({
      heading: { levels: [1, 2, 3] },
      link: { validateUrl: (url) => url.startsWith("https://") },
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `preset` | `"minimal" \| "blog" \| "full"` | `"full"` | Preset configuration to use |
| `bold` | `false \| Partial<BoldConfig>` | enabled | Bold text formatting |
| `italic` | `false \| Partial<ItalicConfig>` | enabled | Italic text formatting |
| `underline` | `false \| Partial<UnderlineConfig>` | enabled | Underline text formatting |
| `strike` | `false \| Partial<StrikeConfig>` | enabled | Strikethrough text formatting |
| `subscript` | `false \| Partial<SubscriptConfig>` | enabled | Subscript text formatting |
| `superscript` | `false \| Partial<SuperscriptConfig>` | enabled | Superscript text formatting |
| `highlight` | `false \| Partial<HighlightConfig>` | enabled | Text highlight formatting |
| `heading` | `false \| Partial<HeadingConfig>` | enabled | Heading levels (h1–h6) |
| `blockquote` | `false \| Partial<BlockquoteConfig>` | enabled | Block quote support |
| `list` | `false \| Partial<ListConfig>` | enabled | Ordered, unordered, and checklist |
| `code` | `false \| Partial<CodeConfig>` | enabled | Inline code formatting |
| `alignment` | `false \| Partial<AlignmentConfig>` | enabled | Text alignment (left, center, right, justify) |
| `link` | `false \| Partial<LinkConfig>` | enabled | Link node with toggle commands |
| `history` | `false \| Partial<HistoryConfig>` | enabled | Undo/redo history |
| `autoLink` | `false \| Partial<AutoLinkConfig>` | enabled | Automatic URL detection and linkification |
| `dragDropPaste` | `false \| Partial<DragDropPasteConfig>` | enabled | File drag-and-drop and paste handling |
| `fontSize` | `false \| Partial<FontSizeConfig>` | enabled | Font size control |
| `fontFamily` | `false \| Partial<FontFamilyConfig>` | enabled | Font family control |
| `direction` | `false \| Partial<DirectionConfig>` | enabled | Text direction (LTR/RTL) |

Set any extension to `false` to disable it, or pass a partial config object to customize it.

## Presets

### `"minimal"`
Bold, italic, heading (h1–h3), history.

### `"blog"`
Bold, italic, underline, strike, heading (h1–h3), blockquote, list, link, autoLink, history.

### `"full"` (default)
All 19 extensions enabled with sensible defaults.

## API

### Exported Types

- **`StarterKitOptions`** — Extension configuration interface.

### Individual Extension Re-exports

Each bundled extension is also exported individually for tree-shaking:

```ts
import {
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  StrikeExtension,
  SubscriptExtension,
  SuperscriptExtension,
  HighlightExtension,
  HeadingExtension,
  BlockquoteExtension,
  ListExtension,
  CodeExtension,
  AlignmentExtension,
  LinkExtension,
  HistoryExtension,
  FontSizeExtension,
  FontFamilyExtension,
  DirectionExtension,
} from "@typix-editor/extension-starter-kit"
```
