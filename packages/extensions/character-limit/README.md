# @typix-editor/extension-character-limit

Visual character counter with configurable limit and charset encoding.

## Installation

```bash
npm install @typix-editor/extension-character-limit
# or
pnpm add @typix-editor/extension-character-limit
```

## Usage

```ts
import { CharacterLimitExtension } from "@typix-editor/extension-character-limit"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    CharacterLimitExtension({
      maxLength: 280,
      onChange: (count, max) => {
        console.log(`${count}/${max}`)
      },
    }),
  ],
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxLength` | `number` | `280` | Maximum number of characters allowed |
| `charset` | `"UTF-8" \| "UTF-16"` | `"UTF-16"` | Charset used for counting (`UTF-16` = JS `string.length`, `UTF-8` = byte count) |
| `disabled` | `boolean` | `false` | Temporarily disable character limit behavior |
| `onChange` | `(count: number, max: number) => void` | - | Called whenever the character count changes |

## API

| Export | Type | Description |
|--------|------|-------------|
| `CharacterLimitExtension` | Function | Extension factory |
| `CharacterLimitConfig` | Type | Configuration interface |
