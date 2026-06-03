# Static Extensions Migration

> **Status**: Planning
> **Trigger**: Lexical core team feedback (post Phase 4 migration)

---

## Feedback

> "The goal here is to use lexical extensions natively to be more broadly compatible with the lexical ecosystem, not add some other thing also called extensions"

> "Extensions are also supposed to be defined statically, it looks like these are generating them at runtime"

> "Yes I see typix extensions are creating lexical extensions dynamically in their implementation, but that's not really useful to anyone else"

> "Extensions can have arbitrary outputs for things like commands, react components, etc."

---

## What Is Still Wrong After Phase 4

Phase 4 removed `defineTypixExtension` and made extensions return `AnyLexicalExtension`.
That was correct. But the factory function wrapper itself survived — and that is the remaining problem.

### Problem 1 — Extensions are factory functions, not Lexical extensions

```ts
// BoldExtension is a FUNCTION, not a Lexical extension
export const BoldExtension = (userConfig = {}) => {
  const lexicalExt = defineExtension({ ... })   // the real thing is created here
  registerTypixMeta(lexicalExt, { ... })
  return lexicalExt                              // and returned
}
```

`BoldExtension` is not importable by the Lexical ecosystem.
You cannot pass it to any Lexical API.
Every call creates a new object — WeakMap keys are unstable.

```ts
BoldExtension() === BoldExtension()   // false — different objects every time
getTypixMeta(BoldExtension)           // undefined — it's a function, not an extension
```

### Problem 2 — Per-editor outputs use 6 separate ad-hoc patterns

Six extensions each implement the same manual WeakMap pattern independently:

```ts
// slash-command does this
const _outputByEditor = new WeakMap<LexicalEditor, SlashCommandOutput>()
export function getSlashCommandOutput(editor) { return _outputByEditor.get(editor) }

// floating-link does this (same pattern, different name)
const _outputByEditor = new WeakMap<LexicalEditor, FloatingLinkOutput>()
export function getFloatingLinkOutput(editor) { return _outputByEditor.get(editor) }

// mention, code-block, code-block-prettier, speech-to-text — all the same
```

No consistency. No generic access pattern. Every consumer must know the
specific function name for each extension.

---

## Goal After This Migration

```ts
// BoldExtension IS a Lexical extension — a static object
import { BoldExtension } from '@typix-editor/extension-starter-kit'

// Usable in ANY Lexical project, no Typix required
createEditor({ extensions: [configExtension(BoldExtension, { disabled: false })] })

// Usable in Typix as before
createTypix({ extensions: [BoldExtension] })

// ONE generic pattern for per-editor outputs
getExtensionOutput<SlashCommandOutput>(editor, SlashCommandExtension)
getExtensionOutput<FloatingLinkOutput>(editor, FloatingLinkExtension)
```

---

## Design Rules

1. **Static by default** — every leaf extension is a module-level constant defined with `defineExtension()`
2. **Config via `configExtension()`** — Lexical's native mechanism, not a Typix factory
3. **Factories only when truly needed** — decorator nodes that require a React component renderer (image, collapsible)
4. **`registerTypixMeta` is fine** — it's a side-channel WeakMap, not a wrapper, doesn't affect Lexical compatibility
5. **One output pattern** — `registerExtensionOutput` / `getExtensionOutput` from core replaces all manual WeakMaps
6. **Stable keys** — static extensions have stable object identity, making WeakMap lookups reliable

---

## Migration Pattern Reference

### Leaf extension — no config (fully static)

```ts
// BEFORE
export const BoldExtension = (userConfig: Partial<BoldConfig> = {}) => {
  const resolvedConfig = { ...userConfig }
  const lexicalExt = defineExtension({
    name: "@typix/bold",
    config: safeCast<BoldConfig>(resolvedConfig),
    mergeConfig: (a, b) => ({ ...a, ...b }),
    build: (_editor, config) => namedSignals(config),
    register(editor, _config, state) {
      const { disabled } = state.getOutput()
      return effect(() => {
        if (disabled?.value) return
        return editor.registerCommand(TYPIX_TOGGLE_BOLD, () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
          return true
        }, COMMAND_PRIORITY_EDITOR)
      })
    },
  })
  registerTypixMeta(lexicalExt, {
    commands: { toggleBold: TYPIX_TOGGLE_BOLD },
    shortcuts: [{ key: "b", modifiers: ["mod"], command: "toggleBold" }],
  })
  return lexicalExt
}

// AFTER
export const BoldExtension = defineExtension({
  name: "@typix/bold",
  config: safeCast<BoldConfig>({ disabled: false }),   // defaults live here
  mergeConfig: (a, b) => ({ ...a, ...b }),             // Lexical merges via configExtension
  build: (_editor, config) => namedSignals(config),
  register(editor, _config, state) {
    const { disabled } = state.getOutput()
    return effect(() => {
      if (disabled?.value) return
      return editor.registerCommand(TYPIX_TOGGLE_BOLD, () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        return true
      }, COMMAND_PRIORITY_EDITOR)
    })
  },
})

registerTypixMeta(BoldExtension, {
  commands: { toggleBold: TYPIX_TOGGLE_BOLD },
  shortcuts: [{ key: "b", modifiers: ["mod"], command: "toggleBold" }],
})

// Consumer — static, no call needed
createTypix({ extensions: [BoldExtension] })

// Consumer — with config override
createTypix({ extensions: [configExtension(BoldExtension, { disabled: true })] })
```

---

### Extension with per-editor output (static + registerExtensionOutput)

```ts
// BEFORE
const _outputByEditor = new WeakMap<LexicalEditor, SlashCommandOutput>()

export function getSlashCommandOutput(editor: LexicalEditor) {
  return _outputByEditor.get(editor)
}

export const SlashCommandExtension = (userConfig = {}) => {
  const resolvedConfig = { trigger: "/", disabled: false, ...userConfig }
  const lexicalExt = defineExtension({
    name: "@typix/slash-command",
    config: safeCast<SlashCommandConfig>(resolvedConfig),
    build(editor) {
      const output = { isActive: signal(false), query: signal<string | null>(null) }
      _outputByEditor.set(editor, output)   // manual WeakMap
      return output
    },
    register(editor, _config, state) { ... },
  })
  registerTypixMeta(lexicalExt, { commands: { insertSlashCommand: TYPIX_INSERT_SLASH_COMMAND }, ... })
  return lexicalExt
}

// AFTER
export const SlashCommandExtension = defineExtension({
  name: "@typix/slash-command",
  config: safeCast<SlashCommandConfig>({ trigger: "/", disabled: false }),
  mergeConfig: (a, b) => ({ ...a, ...b }),
  build(editor) {
    const output = { isActive: signal(false), query: signal<string | null>(null) }
    registerExtensionOutput(editor, SlashCommandExtension, output)   // from core
    return output
  },
  register(editor, _config, state) { ... },
})

registerTypixMeta(SlashCommandExtension, {
  commands: { insertSlashCommand: TYPIX_INSERT_SLASH_COMMAND },
  shortcuts: [{ key: "/", modifiers: ["mod"], command: "insertSlashCommand" }],
})

// Consumer
const output = getExtensionOutput<SlashCommandOutput>(editor, SlashCommandExtension)
output?.isActive  // Signal<boolean>
output?.query     // Signal<string | null>
```

---

### StarterKit — uses configExtension instead of calling factories

```ts
// BEFORE
if (merged.bold !== false) subExts.push(BoldExtension(merged.bold ?? {}))

// AFTER
if (merged.bold !== false) {
  subExts.push(
    merged.bold
      ? configExtension(BoldExtension, merged.bold)
      : BoldExtension
  )
}
```

---

## Phases

---

### Phase 1 — Core output infrastructure
**Risk: Zero. Purely additive.**

Add `registerExtensionOutput` and `getExtensionOutput` to `packages/core/src/meta/index.ts`.
Export from `packages/core/src/index.ts`. Write tests.
Nothing else changes. Existing code continues to work.

**Files:**
- `packages/core/src/meta/index.ts` — add two functions
- `packages/core/src/index.ts` — export them
- `packages/core/src/__tests__/meta/meta.test.ts` — add tests

**What to add:**

```ts
// Shared store keyed by (editor, extension)
const outputStore = new WeakMap<LexicalEditor, WeakMap<AnyLexicalExtension, unknown>>()

export function registerExtensionOutput<T>(
  editor: LexicalEditor,
  ext: AnyLexicalExtension,
  output: T
): void {
  if (!outputStore.has(editor)) outputStore.set(editor, new WeakMap())
  outputStore.get(editor)!.set(ext, output)
}

export function getExtensionOutput<T>(
  editor: LexicalEditor,
  ext: AnyLexicalExtension
): T | undefined {
  return outputStore.get(editor)?.get(ext) as T | undefined
}
```

**Verification:**
```bash
pnpm turbo build --filter='./packages/core'
pnpm turbo test --filter='./packages/core'
```

---

### Phase 2 — Starter-kit sub-extensions → static
**Risk: Low. Internal change, no consumer API break.**

Every sub-extension in `packages/extensions/starter-kit/src/extensions/` becomes a static
module-level constant. The factory function is removed. Defaults move into `config:`.
`registerTypixMeta` moves to module level.

**Files (~20):**
- `bold/index.ts`
- `italic/index.ts`
- `underline/index.ts`
- `strike/index.ts`
- `subscript/index.ts`
- `superscript/index.ts`
- `highlight/index.ts`
- `heading/index.ts`
- `blockquote/index.ts`
- `list/index.ts`
- `code/index.ts`
- `alignment/index.ts`
- `link/index.ts`
- `history/index.ts`
- `auto-link/index.ts`
- `drag-drop-paste/index.ts`
- `font-size/index.ts`
- `font-family/index.ts`
- `text-color/index.ts`
- `direction/index.ts`

**Pattern for each file:**
1. Move `defineExtension({...})` to module level
2. Move defaults from `resolvedConfig` into `config: safeCast({...})`
3. Ensure `mergeConfig` is defined (needed for `configExtension` to work)
4. Move `registerTypixMeta(...)` to module level
5. Remove factory function wrapper

**Verification:**
```bash
pnpm turbo build --filter='./packages/extensions/starter-kit'
pnpm turbo test --filter='./packages/extensions/starter-kit'
```

---

### Phase 3 — StarterKit composer uses configExtension
**Risk: Low. Depends on Phase 2.**

Update `packages/extensions/starter-kit/src/starter-kit/index.ts` to use
`configExtension()` instead of calling the now-removed factory functions.

**Before:**
```ts
if (merged.bold !== false) subExts.push(BoldExtension(merged.bold ?? {}))
```

**After:**
```ts
if (merged.bold !== false) {
  subExts.push(
    merged.bold
      ? configExtension(BoldExtension, merged.bold)
      : BoldExtension
  )
}
```

StarterKit itself stays as a factory — it is a composer, not a leaf extension.
Consumers still call `StarterKit()` and `StarterKit({ bold: false })` — no API change.

**Files:**
- `packages/extensions/starter-kit/src/starter-kit/index.ts`

**Verification:**
```bash
pnpm turbo build --filter='./packages/extensions/starter-kit'
pnpm turbo test --filter='./packages/extensions/starter-kit'
# Verify StarterKit presets still work
# Verify StarterKit({ bold: false }) excludes bold commands
# Verify StarterKit({ preset: "minimal" }) works
```

---

### Phase 4 — Standalone packages → static
**Risk: Medium. Depends on Phase 1. Read each file before changing.**

Same pattern as Phase 2 for the standalone extension packages.
Extensions with per-editor outputs (signals) are handled here too — they use
`registerExtensionOutput` from Phase 1 since the static key is now stable.

**Sub-group A — no per-editor outputs (straightforward):**
- `packages/extensions/link/src/extension/index.ts`
- `packages/extensions/table/src/extension/index.ts`
- `packages/extensions/collapsible/src/extension/index.ts`
- `packages/extensions/image/src/extension/index.ts`

**Sub-group B — has per-editor outputs (use registerExtensionOutput):**
- `packages/extensions/slash-command/src/extension/index.ts`
- `packages/extensions/floating-link/src/extension/index.ts`
- `packages/extensions/mention/src/extension/index.ts`
- `packages/extensions/code-block/src/extension/index.ts`
- `packages/extensions/code-block-prettier/src/extension/index.ts`
- `packages/extensions/speech-to-text/src/extension/index.ts`

For sub-group B, in `build()`:
```ts
build(editor) {
  const output = { ... }
  registerExtensionOutput(editor, SlashCommandExtension, output)  // static key ✓
  return output
}
```

Keep old `getXxxOutput(editor)` functions as thin compat wrappers:
```ts
/** @deprecated Use getExtensionOutput(editor, SlashCommandExtension) */
export function getSlashCommandOutput(editor: LexicalEditor) {
  return getExtensionOutput<SlashCommandOutput>(editor, SlashCommandExtension)
}
```

**Verification:**
```bash
pnpm turbo build --filter='./packages/extensions/...'
pnpm turbo test --filter='./packages/extensions/...'
```

---

### Phase 5 — Update tests
**Risk: Low. Mechanical updates.**

Tests currently call factory functions. Update to use static extensions and
`configExtension` where config is needed.

**Pattern:**
```ts
// BEFORE
const ext = BoldExtension()
const ext = BoldExtension({ disabled: true })

// AFTER
const ext = BoldExtension
const ext = configExtension(BoldExtension, { disabled: true })
```

Tests that check `ext.name`, `getTypixMeta(ext)`, `ext.config` continue to work —
`ext` is now just the static extension object directly.

**Files:**
- All `packages/extensions/*/src/__tests__/*.test.ts` that call factory functions
- `packages/extensions/starter-kit/src/__tests__/starter-kit.test.ts`

**Verification:**
```bash
pnpm turbo test --filter='./packages/extensions/...'
pnpm turbo test --filter='./packages/core'
```

---

### Phase 6 — Cleanup
**Risk: Low. Depends on all previous phases.**

Remove deprecated compat wrappers once all callers have been updated:
- Remove `getSlashCommandOutput`, `getFloatingLinkOutput`, `getMentionOutput`,
  `getCodeBlockOutput`, `getPrettierOutput`, `getSpeechToTextOutput`
- These are replaced by `getExtensionOutput<T>(editor, ext)`

Final full build + typecheck + test run.

**Verification:**
```bash
pnpm turbo build
pnpm turbo typecheck
pnpm turbo test
```

---

## Execution Order

```
Phase 1          Phase 2          Phase 3          Phase 4          Phase 5        Phase 6
Core outputs  →  Starter-kit   →  StarterKit    →  Standalone    →  Tests       →  Cleanup
(additive)       sub-exts         composer         packages         update
                 → static         → configExt      → static
                                                    + outputs
```

Each phase builds on the previous. Do not skip ahead.
Build and test after every phase before moving to the next.

---

## Before / After: Consumer API

```ts
// StarterKit — NO CHANGE
createTypix({ extensions: [StarterKit()] })
createTypix({ extensions: [StarterKit({ bold: false, preset: "minimal" })] })

// Simple extension — remove () call
createTypix({ extensions: [BoldExtension] })         // was: BoldExtension()

// Extension with config — use configExtension
createTypix({ extensions: [configExtension(BoldExtension, { disabled: true })] })
// was: BoldExtension({ disabled: true })

// Reading per-editor outputs — one pattern for all
const output = getExtensionOutput<SlashCommandOutput>(editor, SlashCommandExtension)
// was: getSlashCommandOutput(editor)
```

---

## Why This Matters

After this migration, any Lexical user can do:

```ts
import { BoldExtension } from '@typix-editor/extension-starter-kit'

// Works in a pure Lexical app — no Typix runtime needed
const editor = createEditor({
  extensions: [configExtension(BoldExtension, { disabled: false })]
})
```

`BoldExtension` is a plain `AnyLexicalExtension` object.
It has no Typix-specific wrapper.
The Typix metadata (`registerTypixMeta`) is invisible to Lexical — it's a WeakMap side-channel.
The extension works in any Lexical-compatible tool out of the box.
