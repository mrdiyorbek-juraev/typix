# @typix-editor/react

[![npm version](https://img.shields.io/npm/v/@typix-editor/react)](https://www.npmjs.com/package/@typix-editor/react)
[![npm downloads](https://img.shields.io/npm/dm/@typix-editor/react)](https://www.npmjs.com/package/@typix-editor/react)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/mrdiyorbek-juraev/typix/blob/main/LICENSE)

The core React integration package for [Typix](https://typix.uz) — a headless, extensible rich text editor framework built on Meta's [Lexical](https://lexical.dev).

**[Full documentation →](https://typix.uz/docs)**

## Installation

```bash
pnpm add @typix-editor/react
# or
npm install @typix-editor/react
```

## Quick Start

```tsx
import {
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
  EditorContent,
  EditorRoot,
} from "@typix-editor/react";
import "@typix-editor/react/src/styles/main.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme: defaultTheme,
});

export default function MyEditor() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Start typing..." />
    </EditorRoot>
  );
}
```

## Core Components

| Component | Description |
|-----------|-------------|
| `EditorRoot` | Main wrapper — sets up Lexical composer and context |
| `EditorContent` | Renders the editable content area |
| `EditorBubbleMenu` | Floating toolbar on text selection |
| `EditorCommand` | Slash command menu system |

## Hooks

| Hook | Description |
|------|-------------|
| `useTypixEditor()` | Access the `TypixEditor` instance with fluent API |
| `useBlockType()` | Current block type (`"h1"`, `"paragraph"`, `"bullet"`, etc.) |
| `useActiveFormats()` | Active text formats (`bold`, `italic`, `underline`, etc.) |
| `useEditorState()` | Reactive state — `{ isEmpty }` |
| `useRange()` | Current selection range |
| `useMouseListener()` | Mouse up/down events on the editor |

## Fluent Editor API

`useTypixEditor()` returns a `TypixEditor` instance with chainable methods:

```tsx
const editor = useTypixEditor();

// Toggle inline formats
editor.toggleBold();
editor.toggleItalic();
editor.toggleUnderline();
editor.toggleStrikethrough();
editor.toggleCode();

// Block types
editor.toggleHeading({ level: 1 });
editor.toggleHeading({ level: 2 });
editor.toggleQuote();
editor.toggleBulletList();
editor.toggleOrderedList();

// Links
editor.toggleLink("https://typix.uz");

// History
editor.undo();
editor.redo();
```

## Extensions

Install extensions separately for the features you need:

| Extension | Package |
|-----------|---------|
| Auto Complete | `@typix-editor/extension-auto-complete` |
| Auto Link | `@typix-editor/extension-auto-link` |
| Character Limit | `@typix-editor/extension-character-limit` |
| Code Highlight (Prism) | `@typix-editor/extension-code-highlight-prism` |
| Code Highlight (Shiki) | `@typix-editor/extension-code-highlight-shiki` |
| Collapsible | `@typix-editor/extension-collapsible` |
| Context Menu | `@typix-editor/extension-context-menu` |
| Drag & Drop Paste | `@typix-editor/extension-drag-drop-paste` |
| Draggable Block | `@typix-editor/extension-draggable-block` |
| Floating Link | `@typix-editor/extension-floating-link` |
| Keywords | `@typix-editor/extension-keywords` |
| Link | `@typix-editor/extension-link` |
| Max Length | `@typix-editor/extension-max-length` |
| Mention | `@typix-editor/extension-mention` |
| Keyboard Shortcuts | `@typix-editor/extension-short-cuts` |
| Speech to Text | `@typix-editor/extension-speech-to-text` |
| Tab Focus | `@typix-editor/extension-tab-focus` |

## Initial Content

Pass a serialized Lexical state via `createEditorConfig`:

```tsx
const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme: defaultTheme,
  initialState: {
    root: {
      children: [
        {
          children: [{ detail: 0, format: 0, mode: "normal", style: "", text: "Hello world", type: "text", version: 1 }],
          direction: "ltr", format: "", indent: 0,
          type: "paragraph", version: 1, textFormat: 0, textStyle: "",
        },
      ],
      direction: "ltr", format: "", indent: 0, type: "root", version: 1,
    },
  } as any,
});
```

## License

MIT © [Diyorbek Juraev](https://github.com/mrdiyorbek-juraev)

---

Part of the [Typix](https://typix.uz) editor ecosystem.
