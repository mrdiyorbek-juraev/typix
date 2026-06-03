# @typix-editor/extension-tailwind

Tailwind CSS theme extension that provides sensible default styling for all editor elements.

## Installation

```bash
npm install @typix-editor/extension-tailwind
# or
pnpm add @typix-editor/extension-tailwind
```

## Usage

```ts
import { TailwindExtension } from "@typix-editor/extension-tailwind"
import { createTypix } from "@typix-editor/core"

// Use all defaults
const editor = createTypix({
  extensions: [TailwindExtension()],
})

// Override specific styles
const editor = createTypix({
  extensions: [
    TailwindExtension({
      heading: { h1: "text-4xl font-black" },
      paragraph: "text-base leading-relaxed",
      link: "text-red-600 underline",
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable the theme |
| `heading` | `{ h1–h6?: string }` | Sized headings | Heading level classes |
| `text` | `{ bold?, italic?, underline?, ... }` | Standard formatting | Text formatting classes |
| `list` | `{ checklist?, listitem?, ... }` | Default list styles | List element classes |
| `paragraph` | `string` | `"relative m-0"` | Paragraph classes |
| `link` | `string` | `"text-blue-600 hover:underline hover:cursor-pointer"` | Link classes |
| `quote` | `string` | Blockquote styling | Block quote classes |
| `table` | `string` | Table container styling | Table classes |
| `tableCell` | `string` | Cell styling | Table cell classes |
| `tableCellHeader` | `string` | `"bg-[#f2f3f5] text-start"` | Header cell classes |
| `tableCellEditing` | `string` | Shadow/rounded editing state | Editing cell classes |
| `tableSelection` | `string` | Selection highlight | Table selection classes |
| `hr` | `string` | Horizontal rule styling | `<hr>` classes |
| `hrSelected` | `string` | Selected outline | Selected `<hr>` classes |
| `indent` | `string` | `"[--lexical-indent-base-value:40px]"` | Indent custom property |
| `code` | `string` | Code block styling | Code block classes |
| `codeHighlight` | `{ atrule?, boolean?, ... }` | Syntax token colors | Code syntax highlighting |

All options are deeply merged with defaults — you only need to override what you want to change.

## Default Theme

### Headings

```
h1: "text-2xl font-bold m-0"
h2: "text-xl font-semibold m-0"
h3: "text-lg font-semibold m-0"
h4: "text-base font-semibold m-0"
h5: "text-sm font-semibold m-0"
h6: "text-xs font-semibold m-0"
```

### Text Formatting

```
bold: "font-bold"
italic: "italic"
underline: "underline"
strikethrough: "line-through"
code: "font-mono text-[94%] py-px px-1 bg-slate-100 rounded"
highlight: "bg-[rgba(255,212,0,0.14)] border-solid border-b-2 border-[rgba(255,212,0,0.3)]"
subscript: "text-[0.8em] !align-sub"
superscript: "text-[0.8em] align-super"
```

## API

### Exported Types

- **`TailwindConfig`** — Extension configuration interface.
