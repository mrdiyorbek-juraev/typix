# @typix-editor/extension-collapsible

Expandable/collapsible content sections with title and body.

## Installation

```bash
npm install @typix-editor/extension-collapsible
# or
pnpm add @typix-editor/extension-collapsible
```

## Usage

```ts
import { CollapsibleExtension } from "@typix-editor/extension-collapsible"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    CollapsibleExtension({
      defaultOpen: true,
      onToggle: (isOpen) => console.log("Toggled:", isOpen),
    }),
  ],
})

// Insert a collapsible section
editor.chain().insertCollapsible().run()
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable collapsible behavior |
| `defaultOpen` | `boolean` | `true` | Whether new collapsible sections start open |
| `onToggle` | `(isOpen: boolean) => void` | - | Called when a collapsible's open/closed state changes |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `insertCollapsible` | - | Insert a new collapsible section at the current selection |

The low-level Lexical command `INSERT_COLLAPSIBLE_COMMAND` is also exported for direct dispatch.

## Nodes

| Node | Description |
|------|-------------|
| `CollapsibleContainerNode` | Wrapper element that manages open/closed state |
| `CollapsibleTitleNode` | The clickable title/header area |
| `CollapsibleContentNode` | The body content revealed when open |

## API

| Export | Type | Description |
|--------|------|-------------|
| `CollapsibleExtension` | Function | Extension factory |
| `CollapsibleConfig` | Type | Configuration interface |
| `INSERT_COLLAPSIBLE_COMMAND` | `LexicalCommand` | Lexical command for direct dispatch |
| `CollapsibleContainerNode` | Class | Container node |
| `CollapsibleTitleNode` | Class | Title node |
| `CollapsibleContentNode` | Class | Content node |
| `$createCollapsibleContainerNode` | Function | Create a container node |
| `$createCollapsibleContentNode` | Function | Create a content node |
| `$createCollapsibleTitleNode` | Function | Create a title node |
| `$isCollapsibleContainerNode` | Function | Type guard for container node |
| `$isCollapsibleContentNode` | Function | Type guard for content node |
| `$isCollapsibleTitleNode` | Function | Type guard for title node |
