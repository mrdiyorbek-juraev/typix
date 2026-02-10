# @typix-editor/react

A modern, extensible rich-text editor framework built on [Lexical](https://lexical.dev). Headless-first with full control over rendering.

## Installation

```bash
npm install @typix-editor/react
```

## Quick Start

```tsx
import {
  EditorRoot,
  EditorContent,
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
} from "@typix-editor/react";

const config = createEditorConfig({
  namespace: "MyEditor",
  theme: defaultTheme,
  extensionNodes: [...defaultExtensionNodes],
});

function MyEditor() {
  return (
    <EditorRoot editorConfig={config}>
      <EditorContent />
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
| `useTypixEditor()` | Access the `TypixEditor` instance (fluent API) |
| `useEditorState()` | Reactive state — `{ isEmpty }` |
| `useActiveFormats()` | Current text formats (bold, italic, etc.) |
| `useRange()` | Current selection range |
| `useMouseListener()` | Mouse up/down events |

## Extensions

Install extensions separately for the features you need:

| Extension | Package |
|-----------|---------|
| Link | `@typix-editor/extension-link` |
| Auto-Link | `@typix-editor/extension-auto-link` |
| Floating Link | `@typix-editor/extension-floating-link` |
| Mention | `@typix-editor/extension-mention` |
| Auto-Complete | `@typix-editor/extension-auto-complete` |
| Keyboard Shortcuts | `@typix-editor/extension-short-cuts` |
| Max Length | `@typix-editor/extension-max-length` |
| Code Highlight (Prism) | `@typix-editor/extension-code-highlight-prism` |
| Code Highlight (Shiki) | `@typix-editor/extension-code-highlight-shiki` |
| Collapsible | `@typix-editor/extension-collapsible` |
| Context Menu | `@typix-editor/extension-context-menu` |
| Drag & Drop Paste | `@typix-editor/extension-drag-drop-paste` |
| Draggable Block | `@typix-editor/extension-draggable-block` |
| Keywords | `@typix-editor/extension-keywords` |
| Speech to Text | `@typix-editor/extension-speech-to-text` |
| Tab Focus | `@typix-editor/extension-tab-focus` |

## Lexical Re-exports

If you need direct access to Lexical nodes and commands:

```tsx
import { HeadingNode, ParagraphNode, TextNode, FORMAT_TEXT_COMMAND } from "@typix-editor/react/lexical";
```

## Documentation

Full docs at [typix.com/docs](https://typix.com/docs)

## License

MIT
