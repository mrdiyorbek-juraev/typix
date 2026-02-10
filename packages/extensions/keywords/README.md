# @typix-editor/extension-keywords

Keyword detection and highlighting for Typix editors. Automatically detects congratulation keywords in multiple languages and applies special styling.

## Installation

```bash
npm install @typix-editor/extension-keywords
```

## Usage

```tsx
import { KeywordsExtension, KeywordNode } from "@typix-editor/extension-keywords";

const config = createEditorConfig({
  namespace: "MyEditor",
  extensionNodes: [...defaultExtensionNodes, KeywordNode],
});

<EditorRoot editorConfig={config}>
  <EditorContent />
  <KeywordsExtension />
</EditorRoot>
```

No configuration needed. Detected keywords are wrapped in `KeywordNode` for custom styling.

## Exports

| Export | Description |
|--------|-------------|
| `KeywordsExtension` | Main extension component |
| `KeywordNode` | Custom Lexical node for keywords |
| `$createKeywordNode` | Node factory function |
| `$isKeywordNode` | Type guard |

## Documentation

[typix.com/docs/extensions/keywords](https://typix.com/docs/extensions/keywords)

## License

MIT
