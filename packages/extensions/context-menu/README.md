# @typix-editor/extension-context-menu

Customizable right-click context menu for Typix editors.

## Installation

```bash
npm install @typix-editor/extension-context-menu
```

## Usage

```tsx
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import type { TypixContextMenuItem } from "@typix-editor/extension-context-menu";

const menuItems: TypixContextMenuItem[] = [
  {
    label: "Copy",
    onSelect: (editor) => document.execCommand("copy"),
  },
  { type: "separator" },
  {
    label: "Delete",
    onSelect: (editor, node) => {
      editor.update(() => node?.remove());
    },
    disabled: (editor, node) => !node,
  },
];

<EditorRoot editorConfig={config}>
  <EditorContent />
  <ContextMenuExtension options={menuItems} />
</EditorRoot>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `options` | `TypixContextMenuItem[]` | Menu items and separators |

Each menu item supports `label`, `onSelect`, `disabled`, and `visible` callbacks that receive the editor and target node.

## Documentation

[typix.com/docs/extensions/context-menu](https://typix.com/docs/extensions/context-menu)

## License

MIT
