# Typix Core — `@typix-editor/core`

## Overview

`@typix-editor/core` is the **headless, zero-React heart of Typix**. It wraps Lexical with opinionated abstractions that make building rich-text editors ergonomic without locking you into any UI framework.

**Package location:** `packages/core/`
**npm name:** `@typix-editor/core`
**Dependencies:** `lexical`, `@lexical/*` packages only — no React, no DOM framework

---

## Responsibilities

| Responsibility | API |
|---|---|
| Editor instantiation | `createTypix()`, `TypixEditor` class |
| Extension system | `defineTypixExtension()`, `ExtensionRegistry` |
| Command execution | `executeBuiltinCommand()`, `ChainBuilder` |
| Reactive event bridge | `TypixEventEmitter` |
| Lexical re-exports | nodes, commands, helpers |
| Server-side utilities | `validateEditorState()`, `initializeDocumentState()` |
| DOM utilities | `getDOMRangeRect()`, `setFloatingElemPosition()`, etc. |

---

## Public API

### `createTypix(options)`

The primary factory for creating a Typix editor instance. Returns a `TypixEditorInstance`.

```ts
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [RichTextExtension, LinkExtension],
  theme: myTheme,
  namespace: "my-editor",
  onError: (error) => console.error(error),
})
```

Internally calls Lexical's `createEditor()` with the resolved config from all registered extensions.

---

### `TypixEditor` class

A stateful wrapper around the raw `LexicalEditor` instance. Provides:
- A stable reference you can pass between framework components
- Access to the event emitter
- Helper methods for reading/writing content

```ts
editor.getHTML()       // → string
editor.getText()       // → string
editor.setContent(json) // load serialized content
editor.isEmpty()       // → boolean
editor.chain()         // → ChainBuilder
editor.can()           // → CanChainBuilder (dry-run)
```

---

### Extension System

Extensions are the primary way to add features to the editor. Every piece of behavior — nodes, commands, shortcuts, themes — is expressed as an extension.

#### `defineTypixExtension(definition)`

Creates a typed extension definition:

```ts
import { defineTypixExtension } from "@typix-editor/core"

export const MyExtension = defineTypixExtension({
  name: "my-extension",
  nodes: [MyCustomNode],
  commands: {
    doSomething: (context) => {
      context.editor.update(() => { /* ... */ })
      return true
    },
  },
  shortcuts: {
    "Mod-Shift-M": "doSomething",
  },
})
```

#### `ExtensionRegistry`

Manages the collection of registered extensions and resolves their merged Lexical config:

```ts
const registry = new ExtensionRegistry(extensions)
registry.getLexicalConfig()    // merged CreateEditorArgs
registry.getCommandHandlers()  // all command → handler maps
registry.getShortcuts()        // all shortcut → command maps
```

---

### Command System

#### `executeBuiltinCommand(editor, command, payload?)`

Dispatches a built-in Typix command through the Lexical command system:

```ts
executeBuiltinCommand(editor, "toggleBold")
executeBuiltinCommand(editor, "setFontSize", "16px")
```

#### Built-in commands

| Command | Effect |
|---|---|
| `toggleBold` / `toggleItalic` / `toggleUnderline` | Text formatting |
| `toggleStrikethrough` / `toggleCode` | Text formatting |
| `setFontSize` / `setFontFamily` | Typography |
| `setHeading` | Block type (h1–h6) |
| `setParagraph` | Reset to paragraph |
| `setAlignment` | Element alignment |
| `insertLink` | Insert/update a link node |
| `undo` / `redo` | History |

---

### Chain Builder

Fluent API for chaining multiple commands in sequence:

```ts
editor.chain()
  .toggleBold()
  .setFontSize("18px")
  .run()

// Dry-run (returns true/false without executing)
const canBold = editor.can().toggleBold().run()
```

**Source:** `packages/core/src/editor/chain/`

---

### `TypixEventEmitter`

Bridges Lexical's internal update listeners to a typed, subscribable event system that framework adapters can consume.

```ts
const emitter = new TypixEventEmitter(lexicalEditor)

emitter.on("selectionChange", (payload) => { /* ... */ })
emitter.on("contentChange", (payload) => { /* ... */ })
emitter.on("blur", () => { /* ... */ })
emitter.on("focus", () => { /* ... */ })

emitter.off("selectionChange", handler)
emitter.destroy() // unregisters all Lexical listeners
```

#### Event map

| Event | Payload | Description |
|---|---|---|
| `contentChange` | `SerializedContent` | Fired on every state mutation |
| `selectionChange` | `RangeSelection \| null` | Fired when selection moves |
| `focus` | `void` | Editor gained focus |
| `blur` | `void` | Editor lost focus |
| `editorReady` | `void` | DOM attached and editor ready |

---

### Lexical Re-exports

Core re-exports all commonly-used Lexical primitives so extensions and adapters have a single import source:

```ts
import {
  // Nodes
  ParagraphNode, TextNode, HeadingNode, QuoteNode,
  ListNode, ListItemNode, LinkNode, CodeNode,
  // Commands
  FORMAT_TEXT_COMMAND,
  // State helpers
  $getSelection, $isRangeSelection, $createParagraphNode,
  $setBlocksType, $patchStyleText,
} from "@typix-editor/core"
```

---

### Server-Side Utilities

```ts
import {
  validateEditorState,
  initializeDocumentState,
  clearDocumentState,
} from "@typix-editor/core"
```

| Function | Purpose |
|---|---|
| `validateEditorState(json)` | Verify a serialized state is structurally valid |
| `initializeDocumentState(json)` | Hydrate a headless editor on the server |
| `clearDocumentState()` | Reset a headless editor to an empty document |

These use Lexical's `createHeadlessEditor()` under the hood.

---

## Source Structure

```
packages/core/src/
├── editor/
│   ├── chain/          # ChainBuilder + CanChainBuilder
│   ├── command/        # executeBuiltinCommand, format helpers
│   ├── constants.ts    # BlockType, ElementAlignment, font size limits
│   ├── create/         # createTypix() factory
│   ├── editor/         # TypixEditor class
│   ├── event/          # TypixEventEmitter
│   └── extension/      # defineTypixExtension, ExtensionRegistry
├── lib/
│   └── editor/         # Lexical node + API re-exports
├── server/
│   └── validation.ts   # Headless server utilities
├── types/              # All TypeScript types
├── utils/
│   ├── dom-range-rect/
│   ├── floating-element-position/
│   ├── floating-element-position-for-link/
│   ├── selected-node/
│   ├── swipe/
│   ├── theme-selector/
│   └── url/
├── index.ts            # Public API barrel
└── lexical.ts          # Lexical re-export barrel
```

---

## Dependency Rules

- `@typix-editor/core` may depend on: `lexical`, `@lexical/*`
- `@typix-editor/core` must **never** depend on: `react`, `vue`, any framework, any extension package
- All framework-specific code lives in adapter packages
