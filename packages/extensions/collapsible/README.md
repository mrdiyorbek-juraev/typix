# @typix-editor/extension-collapsible

Collapsible/accordion block extension for Typix editors. Creates expandable sections with a title and content area.

## Installation

```bash
npm install @typix-editor/extension-collapsible
```

## Usage

```tsx
import { CollapsiblePlugin, CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode } from "@typix-editor/extension-collapsible";

const config = createEditorConfig({
  namespace: "MyEditor",
  extensionNodes: [...defaultExtensionNodes, CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode],
});

<EditorRoot editorConfig={config}>
  <EditorContent />
  <CollapsiblePlugin />
</EditorRoot>
```

### Insert Programmatically

```tsx
import { INSERT_COLLAPSIBLE_COMMAND } from "@typix-editor/extension-collapsible";

editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
```

## Exports

| Export | Description |
|--------|-------------|
| `CollapsiblePlugin` | Main extension component |
| `CollapsibleContainerNode` | Container node |
| `CollapsibleTitleNode` | Title node |
| `CollapsibleContentNode` | Content node |
| `INSERT_COLLAPSIBLE_COMMAND` | Command to insert a collapsible block |

## Documentation

[typix.com/docs/extensions/collapsible](https://typix.com/docs/extensions/collapsible)

## License

MIT
