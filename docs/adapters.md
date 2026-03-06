# Framework Adapters

## Overview

Adapters are **thin integration layers** that bind the headless Typix core to a specific UI framework's reactivity model. They consume `@typix-editor/core`, extensions, and the design system, then expose framework-native APIs to developers.

```
@typix-editor/core  +  extensions  +  design-system
              ↓               ↓               ↓
         ┌─────────────────────────────────────┐
         │          Framework Adapter          │
         │  (React / Vue / Svelte / ...)       │
         └─────────────────────────────────────┘
              ↓               ↓               ↓
         Components       Hooks/Composables   Events
```

An adapter's only job is to **translate** — from core's imperative events to the framework's reactive primitives, and from framework component trees to core's DOM attachment points.

---

## React Adapter — `@typix-editor/react`

**Status:** Active
**Package location:** `packages/react/`
**npm name:** `@typix-editor/react`

### What it provides

| Category | Exports |
|---|---|
| Components | `<TypixEditor />`, `<BubbleMenu />`, `<FloatingMenu />`, `<EditorContent />` |
| Hooks | `useTypixEditor`, `useEditorState`, `useBlockType`, `useActiveFormats`, `useSelectionStyle`, `useRange`, `useMouseListener` |
| Context | `TypixEditorProvider`, `useTypixEditorContext` |
| Config | `EditorConfig` type |
| Re-exports | All of `@typix-editor/core` |

### Setup

```tsx
import { useTypixEditor } from "@typix-editor/react"
import { StarterKit } from "@typix-editor/extension-starter-kit"
import "@typix-editor/ui/styles"

function MyEditor() {
  const editor = useTypixEditor({
    extensions: [StarterKit],
  })

  return <EditorContent editor={editor} />
}
```

### Components

#### `<EditorContent />`

Renders the contenteditable div and attaches the Lexical editor to the DOM:

```tsx
<EditorContent
  editor={editor}
  className="my-editor-content"
/>
```

#### `<BubbleMenu />`

A floating toolbar that appears on text selection:

```tsx
<BubbleMenu editor={editor} shouldShow={({ editor }) => !editor.isEmpty()}>
  <BoldButton editor={editor} />
  <ItalicButton editor={editor} />
</BubbleMenu>
```

#### `<FloatingMenu />`

Appears when the cursor is on an empty line (slash-command style):

```tsx
<FloatingMenu editor={editor}>
  <CommandList />
</FloatingMenu>
```

### Hooks

#### `useTypixEditor(options)`

Primary hook for creating and managing a Typix editor instance. Returns a `TypixEditor` instance that stays stable across renders.

```ts
const editor = useTypixEditor({
  extensions: [StarterKit, ImageExtension],
  autofocus: true,
  editable: true,
  content: initialContent,
  onUpdate: ({ editor }) => {
    console.log(editor.getHTML())
  },
})
```

#### `useEditorState(editor)`

Subscribes to editor state changes. Returns reactive state without causing unnecessary re-renders via signal-based diffing.

```ts
const { isEmpty, characterCount } = useEditorState(editor)
```

#### `useBlockType(editor)`

Returns the current block type at the cursor position:

```ts
const blockType = useBlockType(editor)
// → "paragraph" | "h1" | "h2" | "bullet" | "number" | "quote" | "code"
```

#### `useActiveFormats(editor)`

Returns which text formats are currently active at the cursor:

```ts
const formats = useActiveFormats(editor)
// → { bold: true, italic: false, underline: false, ... }
```

#### `useSelectionStyle(editor)`

Returns computed style values at the current selection:

```ts
const style = useSelectionStyle(editor)
// → { fontSize: "16px", fontFamily: "Inter", color: "#000" }
```

#### `useRange(editor)`

Returns the current DOM selection range:

```ts
const range = useRange(editor)
// → DOMRect | null — useful for positioning floating elements
```

### Context

For complex editors with multiple components needing access to the same editor instance:

```tsx
<TypixEditorProvider editor={editor}>
  <Toolbar />
  <EditorContent />
  <StatusBar />
</TypixEditorProvider>

// Inside any child component:
const editor = useTypixEditorContext()
```

### Source Structure

```
packages/react/src/
├── context/            # TypixEditorProvider + useTypixEditorContext
├── core/               # Framework-side components
│   ├── bubble-menu/
│   ├── bubble-menu-item/
│   ├── command-menu/
│   ├── command-list/
│   ├── content/        # <EditorContent />
│   ├── root/
│   └── shortcuts/
├── hooks/
│   ├── index.ts
│   ├── useActiveFormats/
│   ├── useBlockType/
│   ├── useEditorState/
│   ├── useMouseListener/
│   ├── useRange/
│   ├── useSelectionStyle/
│   ├── useSignal/
│   └── useTypixEditorState/
├── config/
├── shared/
├── theme/
├── types/
├── utils/
│   ├── classnames/
│   └── focus-utils/
├── index.ts
└── lexical.ts          # Re-exports @typix-editor/core/lexical
```

---

## Vue Adapter — `@typix-editor/vue`

**Status:** Planned

Will provide:
- `useTypixEditor()` composable
- `<TypixEditor />` component
- `<BubbleMenu />`, `<FloatingMenu />` components
- Reactive state via Vue's `ref()` / `computed()` / `watchEffect()`

The core event emitter (`TypixEventEmitter`) will drive all reactivity — the Vue adapter simply subscribes to those events and updates refs.

---

## Svelte Adapter — `@typix-editor/svelte`

**Status:** Planned

Will provide:
- `createTypixEditor()` using Svelte stores
- `<TypixEditor />` Svelte component
- Writable/readable stores for editor state
- Svelte action (`use:typixEditor`) for DOM attachment

---

## Building a Custom Adapter

Any framework can integrate Typix by consuming the core primitives. The minimum contract:

### 1. Create the editor

```ts
import { createTypix, TypixEventEmitter } from "@typix-editor/core"

const editor = createTypix({ extensions: [/* ... */] })
const emitter = new TypixEventEmitter(editor.lexical)
```

### 2. Attach to the DOM

```ts
// After the DOM element is mounted:
editor.lexical.setRootElement(domElement)
emitter.emit("editorReady")
```

### 3. Subscribe to events

```ts
emitter.on("contentChange", (content) => {
  // Update your framework's reactive state
  myStore.set(content)
})

emitter.on("selectionChange", (selection) => {
  selectionStore.set(selection)
})
```

### 4. Expose commands

```ts
function toggleBold() {
  editor.chain().toggleBold().run()
}
```

### 5. Destroy on unmount

```ts
emitter.destroy()
editor.lexical.setRootElement(null)
```

---

## Dependency Rules

- Adapters may depend on: `@typix-editor/core`, `@typix-editor/theme`, `@typix-editor/ui`, extensions, and their target framework
- Adapters must **never** contain editor state logic — only translate between core events and framework reactivity
- Adapters must **never** depend on other adapters
- `@typix-editor/react` re-exports everything from `@typix-editor/core` for consumer convenience
