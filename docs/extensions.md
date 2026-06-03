# Typix Extensions

## Overview

Extensions are **self-contained, independently publishable packages** that add features to the Typix editor. Each extension encapsulates everything a feature needs: custom nodes, commands, shortcuts, and Lexical plugin logic — with no framework bindings.

Extensions only depend on `@typix-editor/core` (and Lexical transitively). They have **no knowledge of React, Vue, or any UI framework**.

**Package location:** `packages/extensions/`

---

## Extension Catalog

| Package | npm name | Purpose |
|---|---|---|
| `starter-kit` | `@typix-editor/extension-starter-kit` | Curated bundle of the most common extensions |
| `rich-text` | `@typix-editor/rich-text` | Headings, paragraphs, quotes, lists, code blocks |
| `link` | `@typix-editor/link` | Link node, validation, toggle command |
| `auto-link` | `@typix-editor/auto-link` | Automatic URL detection and linkification |
| `image` | `@typix-editor/image` | Image node with upload/drag support |
| `table` | `@typix-editor/table` | Table node with resizing and cell selection |
| `markdown-shortcuts` | `@typix-editor/markdown-shortcuts` | Inline markdown → rich-text transforms |
| `code-highlight-shiki` | `@typix-editor/code-highlight-shiki` | Syntax highlighting via Shiki |
| `code-highlight-prism` | `@typix-editor/code-highlight-prism` | Syntax highlighting via Prism |
| `drag-drop-paste` | `@typix-editor/drag-drop-paste` | File drag/drop and paste handling |
| `draggable-block` | `@typix-editor/draggable-block` | Drag-to-reorder block nodes |
| `floating-link` | `@typix-editor/floating-link` | Floating link editor popup |
| `context-menu` | `@typix-editor/context-menu` | Right-click context menu |
| `auto-complete` | `@typix-editor/auto-complete` | Inline text autocomplete |
| `collapsible` | `@typix-editor/collapsible` | Collapsible block/section node |
| `keywords` | `@typix-editor/keywords` | Keyword highlighting |
| `max-length` | `@typix-editor/max-length` | Character limit enforcement |
| `mention` | `@typix-editor/mention` | @mention node with suggestions |
| `short-cuts` | `@typix-editor/short-cuts` | Keyboard shortcut registry |
| `speech-to-text` | `@typix-editor/speech-to-text` | Voice input via Web Speech API |
| `tab-focus` | `@typix-editor/tab-focus` | Tab key focus trapping |
| `character-limit` | `@typix-editor/character-limit` | Visual character count/limit |

---

## Anatomy of an Extension

Every extension is created with `defineTypixExtension()` from `@typix-editor/core`:

```ts
import { defineTypixExtension } from "@typix-editor/core"
import { MyNode } from "./node"

export const MyExtension = defineTypixExtension({
  // Unique identifier
  name: "my-extension",

  // Custom Lexical nodes this extension registers
  nodes: [MyNode],

  // Lexical theme classes for this extension's nodes
  theme: {
    myNode: "typix-my-node",
  },

  // Commands this extension handles
  commands: {
    insertMyNode: ({ editor }) => {
      editor.update(() => {
        // ... mutate state
      })
      return true // mark command as handled
    },
  },

  // Keyboard shortcuts mapped to commands
  shortcuts: {
    "Mod-Shift-N": "insertMyNode",
  },

  // Raw Lexical plugin setup (runs once on editor mount)
  setup: (editor) => {
    return editor.registerUpdateListener(({ editorState }) => {
      // ... react to state changes
    })
    // return value is the cleanup/unregister function
  },
})
```

---

## Starter Kit

For most use cases, start with `@typix-editor/extension-starter-kit`. It bundles:

```ts
import { StarterKit } from "@typix-editor/extension-starter-kit"

const editor = createTypix({
  extensions: [StarterKit],
})
```

Included by default:
- `RichTextExtension` (headings, paragraphs, lists, quotes, code)
- `HistoryExtension` (undo/redo)
- `LinkExtension`
- `AutoLinkExtension`
- `MarkdownShortcutsExtension`
- `TabFocusExtension`

You can override with options:

```ts
StarterKit.configure({
  history: false,         // disable undo/redo
  link: { autoLink: true },
})
```

---

## Writing a Custom Extension

### 1. Create a custom node (if needed)

Custom nodes extend one of Lexical's base classes:

```ts
import { DecoratorNode } from "@typix-editor/core"
import type { LexicalNode, NodeKey } from "@typix-editor/core"

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string

  static getType() { return "video" }
  static clone(node: VideoNode) { return new VideoNode(node.__src, node.__key) }

  constructor(src: string, key?: NodeKey) {
    super(key)
    this.__src = src
  }

  createDOM() {
    return document.createElement("div")
  }

  updateDOM() { return false }

  decorate() {
    // Return framework component — handled by the adapter
    return { type: "video", src: this.__src }
  }
}
```

### 2. Define the extension

```ts
export const VideoExtension = defineTypixExtension({
  name: "video",
  nodes: [VideoNode],
  commands: {
    insertVideo: ({ editor }, src: string) => {
      editor.update(() => {
        const node = new VideoNode(src)
        $insertNodes([node])
      })
      return true
    },
  },
})
```

### 3. Register with the editor

```ts
const editor = createTypix({
  extensions: [StarterKit, VideoExtension],
})
```

---

## Extension Package Structure

Each extension follows this layout:

```
packages/extensions/my-extension/
├── src/
│   ├── index.ts          # Public API (extension + node + types)
│   ├── extension.ts      # defineTypixExtension() call
│   ├── node.ts           # Custom LexicalNode (if any)
│   ├── commands.ts       # Command handlers
│   └── utils.ts          # Internal helpers
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### `package.json` template

```json
{
  "name": "@typix-editor/my-extension",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "lexical": "*"
  },
  "dependencies": {
    "@typix-editor/core": "workspace:*"
  }
}
```

---

## Dependency Rules

- Extensions may depend on: `@typix-editor/core`, `lexical`, `@lexical/*`
- Extensions must **never** depend on: `react`, `vue`, any adapter package, any other extension (unless composing via core primitives)
- Extensions must **never** render UI — return data/nodes only, let adapters render
