# @typix-editor/extension-max-length

Content length limiter for Typix editors. Supports character, word, and byte counting with configurable strategies.

## Installation

```bash
npm install @typix-editor/extension-max-length
```

## Usage

```tsx
import { MaxLengthExtension } from "@typix-editor/extension-max-length";

<EditorRoot editorConfig={config}>
  <EditorContent />
  <MaxLengthExtension
    maxLength={1000}
    onChange={(current, max, remaining) => {
      console.log(`${remaining} characters remaining`);
    }}
  />
</EditorRoot>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | **Required** | Maximum content length |
| `mode` | `"characters" \| "words" \| "bytes"` | `"characters"` | Counting mode |
| `strategy` | `"prevent" \| "trim"` | `"prevent"` | How to enforce the limit |
| `onChange` | `(current, max, remaining) => void` | - | Callback on content change |
| `onLimitReached` | `(current, max, exceeded) => void` | - | Callback when limit is hit |
| `warningThreshold` | `number` | - | Trigger warning at this count |
| `onWarning` | `(current, max, remaining) => void` | - | Warning callback |
| `countWhitespace` | `boolean` | `true` | Include whitespace in count |
| `customCounter` | `(text: string) => number` | - | Custom counting function |

## Documentation

[typix.com/docs/extensions/max-length](https://typix.com/docs/extensions/max-length)

## License

MIT
