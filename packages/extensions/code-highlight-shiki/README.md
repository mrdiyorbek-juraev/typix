# @typix-editor/extension-code-highlight-shiki

Shiki-based syntax highlighting for code blocks in Typix editors. Provides higher-quality highlighting than Prism using tree-sitter grammars.

## Installation

```bash
npm install @typix-editor/extension-code-highlight-shiki
```

## Usage

```tsx
import { CodeHighlightShikiExtension } from "@typix-editor/extension-code-highlight-shiki";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <CodeHighlightShikiExtension />
</EditorRoot>
```

No configuration needed. Automatically highlights code blocks using Shiki.

## See Also

For a lighter-weight alternative, use [`@typix-editor/extension-code-highlight-prism`](https://www.npmjs.com/package/@typix-editor/extension-code-highlight-prism).

## Documentation

[typix.com/docs/extensions/code-highlight-shiki](https://typix.com/docs/extensions/code-highlight-shiki)

## License

MIT
