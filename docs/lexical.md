# Lexical — Foundation Layer

## What is Lexical?

[Lexical](https://lexical.dev) is an open-source, extensible text editor framework built by Meta. It is the **underlying engine** that Typix is built on. Typix does not fork or patch Lexical — it wraps it with higher-level abstractions.

Lexical is intentionally minimal and low-level. It gives you the primitives to build any editor experience. Typix's job is to make those primitives ergonomic and composable.

---

## What Lexical Owns

### Editor State
Lexical's state model is **immutable and serializable**. Every edit produces a new editor state rather than mutating the previous one. This makes undo/redo, collaboration, and server-side rendering straightforward.

```
EditorState
  └── RootNode
        ├── ParagraphNode
        │     └── TextNode ("Hello world")
        ├── HeadingNode (tag: "h1")
        │     └── TextNode ("Title")
        └── ...
```

### Node System
Everything in the document is a **node**. Lexical ships three base node types:

| Node type | Purpose |
|---|---|
| `TextNode` | Inline text with format flags (bold, italic, etc.) |
| `ElementNode` | Block-level containers (paragraph, heading, list) |
| `DecoratorNode` | Arbitrary React/DOM content (images, embeds, widgets) |

Custom nodes extend one of these three types.

### Command System
Editor operations are expressed as **commands** — typed identifiers dispatched through the editor. Listeners registered on the editor intercept commands and mutate state.

```ts
editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
```

Commands flow through a priority stack. Higher-priority listeners can intercept and stop propagation.

### DOM Reconciliation
Lexical manages its own reconciler between editor state and the DOM. It does **not** use React's virtual DOM for the editable content — it writes directly to the DOM for performance.

---

## What Typix Does NOT Change About Lexical

- The node class hierarchy (`TextNode`, `ElementNode`, `DecoratorNode`)
- The command dispatch mechanism
- Editor state immutability
- The serialization format (`SerializedEditorState`)
- Plugin/listener registration APIs

All of these are used as-is. Typix simply provides a more ergonomic surface over them.

---

## Lexical APIs Used by Typix Core

| API | Used for |
|---|---|
| `createEditor()` | Creating the underlying editor instance |
| `editor.registerCommand()` | Binding command handlers in extensions |
| `editor.registerUpdateListener()` | Reacting to state changes in the event emitter |
| `editor.update()` | Performing all state mutations |
| `$getRoot()`, `$getSelection()` | Reading state inside update callbacks |
| `$setBlocksType()`, `$patchStyleText()` | Applying formatting |
| `LexicalNode`, `ElementNode`, `DecoratorNode` | Base classes for custom nodes |

---

## Key Concepts to Know

### Updates are always synchronous
All mutations to Lexical state happen inside `editor.update(() => { ... })`. You cannot mutate state outside this callback.

### Selections are ephemeral
`$getSelection()` is only valid inside an update or read callback. Never hold a selection reference across async operations.

### Nodes have keys
Every node has a unique `key` string assigned at creation. Keys are stable within a session but not across serialization/deserialization.

### The editor has no UI
Lexical itself renders nothing. It attaches to a DOM element you provide (`editor.setRootElement(domNode)`). All visual chrome — toolbars, menus, floating elements — is your responsibility. Typix's adapters and design system handle this.

---

## Further Reading

- [Lexical official docs](https://lexical.dev/docs/intro)
- [Lexical GitHub](https://github.com/facebook/lexical)
- [Node types deep dive](https://lexical.dev/docs/concepts/nodes)
- [Commands](https://lexical.dev/docs/concepts/commands)
- [Editor state](https://lexical.dev/docs/concepts/editor-state)
