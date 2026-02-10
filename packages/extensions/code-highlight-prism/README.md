# @typix-editor/extension-code-highlight-prism

Prism-based syntax highlighting for code blocks in Typix editors.

## Installation

```bash
npm install @typix-editor/extension-code-highlight-prism
```

## Usage

```tsx
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <CodeHighlightPrismExtension />
</EditorRoot>
```

No configuration needed. Automatically highlights code blocks using PrismJS tokenization.

## See Also

For higher-quality highlighting with tree-sitter, use [`@typix-editor/extension-code-highlight-shiki`](https://www.npmjs.com/package/@typix-editor/extension-code-highlight-shiki).

## Documentation

[typix.com/docs/extensions/code-highlight-prism](https://typix.com/docs/extensions/code-highlight-prism)

## License

MIT
