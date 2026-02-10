# @typix-editor/extension-tab-focus

Tab key focus handling for Typix editors. Preserves text selection when focus returns to the editor via the Tab key.

## Installation

```bash
npm install @typix-editor/extension-tab-focus
```

## Usage

```tsx
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <TabFocusExtension />
</EditorRoot>
```

No configuration needed.

## Documentation

[typix.com/docs/extensions/tab-focus](https://typix.com/docs/extensions/tab-focus)

## License

MIT
