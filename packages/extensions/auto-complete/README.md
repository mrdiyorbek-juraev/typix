# @typix-editor/extension-auto-complete

Word auto-completion extension for Typix editors. Provides intelligent suggestions using a built-in dictionary with debouncing and caching.

## Installation

```bash
npm install @typix-editor/extension-auto-complete
```

## Usage

```tsx
import { AutocompleteExtension, AutocompleteNode } from "@typix-editor/extension-auto-complete";

const config = createEditorConfig({
  namespace: "MyEditor",
  extensionNodes: [...defaultExtensionNodes, AutocompleteNode],
});

<EditorRoot editorConfig={config}>
  <EditorContent />
  <AutocompleteExtension />
</EditorRoot>
```

Accept suggestions with `Tab` or the right arrow key. Supports both keyboard and touch gestures.

## Exports

| Export | Description |
|--------|-------------|
| `AutocompleteExtension` | Main extension component |
| `AutocompleteNode` | Custom Lexical node for completions |
| `$createAutocompleteNode` | Node factory function |

## Documentation

[typix.com/docs/extensions/auto-complete](https://typix.com/docs/extensions/auto-complete)

## License

MIT
