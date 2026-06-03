# Migration Plan: Native Lexical Extensions

> **Goal**: Make Typix extensions BE native Lexical extensions, not wrappers around them.
> **Trigger**: Lexical core team feedback — Typix creates a parallel extension system instead of using Lexical's natively.

---

## Problem Statement

### What the Lexical team said:
1. **"Use Lexical extensions natively, not add some other thing also called extensions"**
2. **"Extensions are supposed to be defined statically, not generated at runtime"**
3. **"Typix extensions create Lexical extensions dynamically in their implementation, but that's not useful to anyone else"**

### What's wrong today:

```
User → TypixExtensionDefinition (wrapper) → LexicalExtension (hidden inside .typix) → Lexical Editor
```

| Problem | Detail |
|---------|--------|
| **Parallel system** | `defineTypixExtension()` creates a competing abstraction over Lexical's `defineExtension()` |
| **Hidden Lexical extensions** | The real Lexical extension is buried in `.typix` — an implementation detail, not the public API |
| **Custom command dispatch** | `ExtensionRegistry` + `CommandHandler` bypasses Lexical's native `registerCommand()` / `dispatchCommand()` |
| **Not ecosystem-compatible** | A plain Lexical user can't import and use a Typix extension — they'd need the entire Typix runtime |
| **Runtime generation** | Factory functions create new extension instances on every call instead of static declarations |

### What we want after:

```
User → LexicalExtension (with optional Typix metadata) → Lexical Editor
```

- Extensions ARE Lexical extensions — usable by anyone in the Lexical ecosystem
- Commands registered via Lexical's native `registerCommand()` / `dispatchCommand()`
- Typix chain API and shortcuts are an optional DX layer on top, not a requirement
- Static extensions where possible; factories only when config is truly needed

---

## Design Principles

1. **Lexical-first**: The extension IS a `defineExtension()` call. Period.
2. **Metadata, not wrapping**: Typix DX features (chain API names, shortcuts) are stored as metadata alongside the extension, not in a wrapper around it.
3. **Ecosystem-compatible**: Any Lexical user can `import { BoldExtension } from '@typix/starter-kit'` and use it directly in `buildEditorFromExtensions()`.
4. **Static by default**: Extensions that don't need config are static module-level constants. Factories are used only when config parameterization is needed — and they return `LexicalExtension`, not a wrapper.
5. **Preserve Typix DX**: The chain API, shortcuts, and event system still work — they just read from Lexical's native system instead of a parallel one.

---

## Architecture: Before vs After

### Before (current):
```ts
// Extension definition — returns TypixExtensionDefinition (NOT a Lexical extension)
export const BoldExtension = (config = {}) => {
  const lexicalExt = defineExtension({ name: "@typix/bold", ... });
  return defineTypixExtension({
    name: "bold",
    typix: lexicalExt,                    // Lexical ext hidden inside
    commands: { toggleBold: ... },        // Typix command system
    shortcuts: [{ key: "b", ... }],       // Typix shortcut system
  });
};

// Consumer — passes TypixExtensionDefinition[], Typix extracts .typix internally
createTypix({ extensions: [BoldExtension()] })
```

### After (target):
```ts
// Extension definition — returns a native LexicalExtension
export const TYPIX_TOGGLE_BOLD = createCommand<void>('TYPIX_TOGGLE_BOLD');

export const BoldExtension = defineExtension({
  name: "@typix/bold",
  config: safeCast<BoldConfig>({ disabled: false }),
  build(_editor, config) { return namedSignals(config); },
  register(editor, _config, state) {
    const { disabled } = state.getOutput();
    return effect(() => {
      if (disabled.value) return;
      return editor.registerCommand(TYPIX_TOGGLE_BOLD, () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        return true;
      }, COMMAND_PRIORITY_EDITOR);
    });
  },
});

// Typix metadata — stored in WeakMap, not a wrapper
registerTypixMeta(BoldExtension, {
  commands: { toggleBold: TYPIX_TOGGLE_BOLD },
  shortcuts: [{ key: "b", modifiers: ["mod"], command: "toggleBold" }],
});

// Consumer — passes LexicalExtension[] directly
createTypix({ extensions: [BoldExtension] })

// Config override — uses Lexical's native configExtension()
createTypix({ extensions: [configExtension(BoldExtension, { disabled: true })] })
```

---

## Phase 1: Typix Metadata System (new utility)

> **Goal**: Create a lightweight side-channel for Typix DX metadata without wrapping Lexical extensions.

### 1.1 Create `packages/core/src/meta/index.ts`

```ts
import type { AnyLexicalExtension, LexicalCommand } from 'lexical'

// ── Types ──

export interface TypixCommandMap {
  [commandName: string]: LexicalCommand<any>
}

export interface TypixShortcut {
  key: string
  modifiers: Array<'mod' | 'shift' | 'alt'>
  command: string   // references a key in TypixCommandMap
  args?: unknown
}

export interface TypixMeta {
  /** Maps friendly command names to Lexical commands */
  commands?: TypixCommandMap
  /** Keyboard shortcuts that dispatch commands */
  shortcuts?: TypixShortcut[]
}

// ── Storage ──

const metaStore = new WeakMap<AnyLexicalExtension, TypixMeta>()

/** Attach Typix metadata to a native Lexical extension. */
export function registerTypixMeta(
  extension: AnyLexicalExtension,
  meta: TypixMeta,
): void {
  metaStore.set(extension, meta)
}

/** Read Typix metadata from a Lexical extension (if any). */
export function getTypixMeta(
  extension: AnyLexicalExtension,
): TypixMeta | undefined {
  return metaStore.get(extension)
}
```

### 1.2 Create convenience helper `typixExtension()`

A one-liner that defines + annotates in a single call:

```ts
/** Define a Lexical extension with Typix metadata in one call. */
export function typixExtension<TConfig>(
  definition: LexicalExtensionDefinition<TConfig>,
  meta?: TypixMeta,
): AnyLexicalExtension {
  const ext = defineExtension(definition)
  if (meta) registerTypixMeta(ext, meta)
  return ext
}
```

### 1.3 Handle `configExtension()` metadata propagation

When `configExtension(ext, overrides)` is called, Lexical returns a new extension object. The WeakMap metadata would be lost. We need a wrapper:

```ts
import { configExtension as lexicalConfigExtension } from 'lexical'

/** configExtension that preserves Typix metadata. */
export function configExtension<TConfig>(
  extension: AnyLexicalExtension,
  config: Partial<TConfig>,
): AnyLexicalExtension {
  const result = lexicalConfigExtension(extension, config)
  const meta = getTypixMeta(extension)
  if (meta) registerTypixMeta(result, meta)
  return result
}
```

### Files to create/modify:
- **Create**: `packages/core/src/meta/index.ts`
- **Modify**: `packages/core/src/index.ts` (export new utilities)

---

## Phase 2: Refactor Core Types

> **Goal**: Remove `TypixExtensionDefinition` and make `createTypix` accept native Lexical extensions.

### 2.1 Remove from `packages/core/src/types/index.ts`:
- `TypixExtensionDefinition` interface
- `CommandFunction` type
- `CommandHandler` type
- `CommandContext` type
- `BuiltinCommands` type

### 2.2 Update `CreateTypixOptions`:
```ts
export interface CreateTypixOptions {
  /** Native Lexical extensions to include */
  extensions: AnyLexicalExtension[]
  editable?: boolean
  namespace?: string
  theme?: EditorThemeClasses
  content?: SerializedContent | string
  nodes?: LexicalNode[]
  onError?: (error: Error) => void
}
```

### 2.3 Keep these types (still needed):
- `ShortcutDefinition` → renamed to `TypixShortcut` (moved to meta)
- `SerializedContent`, `SerializedRootNode`, `SerializedNode`
- `TypixEventMap`, `TypixEventName`, `TypixEventListener`
- `TypixEditorInstance` (updated — see Phase 3)
- `ChainBuilder`, `CanChainBuilder` (updated — see Phase 3)

### Files to modify:
- `packages/core/src/types/index.ts`

---

## Phase 3: Refactor Core Engine

> **Goal**: `createTypix`, `TypixEditor`, `ExtensionRegistry`, and chain API work with native Lexical extensions.

### 3.1 Simplify `ExtensionRegistry`

The registry no longer stores `TypixExtensionDefinition`. Instead, it reads `TypixMeta` from extensions via the WeakMap:

```ts
export class ExtensionRegistry {
  private extensions: AnyLexicalExtension[] = []
  private commandMap: Map<string, LexicalCommand<any>> = new Map()
  private shortcuts: TypixShortcut[] = []

  register(extension: AnyLexicalExtension): void {
    this.extensions.push(extension)

    const meta = getTypixMeta(extension)
    if (!meta) return

    // Collect command name → LexicalCommand mappings
    if (meta.commands) {
      for (const [name, cmd] of Object.entries(meta.commands)) {
        if (this.commandMap.has(name)) {
          console.warn(`[Typix] Command "${name}" already registered.`)
          continue
        }
        this.commandMap.set(name, cmd)
      }
    }

    // Collect shortcuts
    if (meta.shortcuts) {
      this.shortcuts.push(...meta.shortcuts)
    }
  }

  /** Get the Lexical command for a named Typix command. */
  getLexicalCommand(name: string): LexicalCommand<any> | undefined {
    return this.commandMap.get(name)
  }

  hasCommand(name: string): boolean {
    return this.commandMap.has(name)
  }

  getAllExtensions(): AnyLexicalExtension[] {
    return [...this.extensions]
  }

  getAllShortcuts(): TypixShortcut[] {
    return [...this.shortcuts]
  }
}
```

**Key change**: Registry no longer stores pre-bound command handlers. It stores `string → LexicalCommand` mappings. Actual command handling happens in Lexical's native `registerCommand()` inside each extension's `register()` hook.

### 3.2 Update Chain API

The chain builder dispatches Lexical commands instead of calling pre-bound handlers:

```ts
function dispatchCommand(
  editor: LexicalEditor,
  registry: ExtensionRegistry,
  name: string,
  args: unknown[],
): boolean {
  // 1. Check if this is a Typix-registered command name
  const lexicalCommand = registry.getLexicalCommand(name)
  if (lexicalCommand) {
    // Dispatch via Lexical's native command system
    return editor.dispatchCommand(lexicalCommand, args[0])
  }

  // 2. Fall back to built-in commands (focus, blur, toggleMark, etc.)
  return executeBuiltinCommand(editor, name, args)
}
```

**Key change**: No more `CommandContext`, `BuiltinCommands`, or pre-bound handlers. The chain API simply dispatches Lexical commands. The actual handler logic lives in the extension's `register()` hook.

### 3.3 Update `createTypix`

```ts
export function createTypix(options: CreateTypixOptions): TypixEditorInstance {
  const {
    extensions = [],
    editable = true,
    namespace = 'typix',
    theme = {},
    content,
    onError = (err) => { throw err },
  } = options

  // 1. Build registry (reads TypixMeta from extensions)
  const registry = new ExtensionRegistry()
  for (const ext of extensions) {
    registry.register(ext)
  }

  // 2. Build root Lexical extension (extensions are ALREADY Lexical extensions)
  const rootExtension = defineExtension({
    name: `@typix/root/${namespace}`,
    namespace,
    editable,
    theme,
    onError,
    dependencies: extensions,  // Direct — no .typix extraction needed
  })

  // 3. Build Lexical editor
  const lexicalEditor = buildEditorFromExtensions(rootExtension)

  // 4. Wrap in TypixEditor
  const typixEditor = new TypixEditor(lexicalEditor, registry, namespace, ...)

  // 5. Apply initial content
  if (content) setEditorContent(lexicalEditor, content)

  return typixEditor
}
```

### 3.4 Update `TypixEditor` class

Remove `getExtension()` / `hasExtension()` that operated on `TypixExtensionDefinition`. Replace with simpler alternatives if needed.

### 3.5 Simplify `CanChainBuilder`

```ts
function canDispatchCommand(
  registry: ExtensionRegistry,
  name: string,
  args: unknown[],
): boolean {
  if (registry.hasCommand(name)) return true
  return isKnownBuiltinCommand(name, args)
}
```

### Files to modify:
- `packages/core/src/editor/extension/index.ts` — simplified registry
- `packages/core/src/editor/chain/index.ts` — dispatch via Lexical commands
- `packages/core/src/editor/create/index.ts` — accept LexicalExtension[]
- `packages/core/src/editor/editor/index.ts` — remove TypixExtensionDefinition refs

---

## Phase 4: Migrate All Extensions

> **Goal**: Every extension in `packages/extensions/` becomes a native Lexical extension.

### 4.1 Pattern A: Simple mark extensions (no config needed → static)

**Applies to**: bold, italic, underline, strike, subscript, superscript, highlight, code

Before:
```ts
export const BoldExtension = (userConfig: Partial<BoldConfig> = {}) => {
  const resolvedConfig = { ...userConfig };
  const lexicalExt = defineExtension({ name: "@typix/bold", ... });
  return defineTypixExtension({ name: "bold", typix: lexicalExt, commands: {...}, ... });
};
```

After:
```ts
export const TYPIX_TOGGLE_BOLD = createCommand<void>('TYPIX_TOGGLE_BOLD');

export const BoldExtension = typixExtension(
  {
    name: "@typix/bold",
    config: safeCast<BoldConfig>({ disabled: false }),
    build(_editor, config) { return namedSignals(config); },
    register(editor, _config, state) {
      const { disabled } = state.getOutput();
      return effect(() => {
        if (disabled.value) return;
        return editor.registerCommand(TYPIX_TOGGLE_BOLD, () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          return true;
        }, COMMAND_PRIORITY_EDITOR);
      });
    },
  },
  {
    commands: { toggleBold: TYPIX_TOGGLE_BOLD },
    shortcuts: [{ key: "b", modifiers: ["mod"], command: "toggleBold" }],
  }
);

// Config override: configExtension(BoldExtension, { disabled: true })
```

**Changes per extension**:
- Remove factory wrapper (or keep minimal factory for config, returning `AnyLexicalExtension`)
- Move command logic into `register()` as a Lexical command
- Export `LexicalCommand` constants
- Attach Typix metadata via `typixExtension()` or `registerTypixMeta()`

### 4.2 Pattern B: Extensions with config (factory still needed)

**Applies to**: heading, list, alignment, font-size, font-family, text-color, direction, link, image, mention, collapsible, table, code-block, character-limit, max-length, auto-complete, auto-link, drag-drop-paste

Before:
```ts
export const HeadingExtension = (userConfig: Partial<HeadingConfig> = {}) => {
  const resolvedConfig = { levels: [1,2,3,4,5,6], ...userConfig };
  const lexicalExt = defineExtension({ ... });
  return defineTypixExtension({ name: "heading", typix: lexicalExt, commands: {...} });
};
```

After:
```ts
export const TYPIX_TOGGLE_HEADING = createCommand<{ level: number }>('TYPIX_TOGGLE_HEADING');

// Static base extension (default config)
const BaseHeadingExtension = typixExtension(
  {
    name: "@typix/heading",
    nodes: () => [HeadingNode],
    config: safeCast<HeadingConfig>({ disabled: false, levels: [1,2,3,4,5,6] }),
    build(_editor, config) { return namedSignals(config); },
    register(editor, _config, state) {
      const { disabled, levels } = state.getOutput();
      return effect(() => {
        if (disabled.value) return;
        return editor.registerCommand(TYPIX_TOGGLE_HEADING, (payload) => {
          const allowedLevels = levels.value;
          if (!allowedLevels.includes(payload.level)) return false;
          // ... toggle heading logic
          return true;
        }, COMMAND_PRIORITY_EDITOR);
      });
    },
  },
  {
    commands: { toggleHeading: TYPIX_TOGGLE_HEADING },
  }
);

// Factory for config customization (returns LexicalExtension, NOT a wrapper)
export function HeadingExtension(userConfig?: Partial<HeadingConfig>) {
  if (!userConfig || Object.keys(userConfig).length === 0) {
    return BaseHeadingExtension;  // Return static instance when no config
  }
  return configExtension(BaseHeadingExtension, userConfig);
}
```

**Key**: Factory returns `AnyLexicalExtension`, not `TypixExtensionDefinition`. When no config is provided, returns the static base instance. `configExtension()` preserves metadata.

### 4.3 Pattern C: Extensions with decorator nodes

**Applies to**: image, collapsible (anything with `DecoratorNode.decorate()`)

These extensions pass a `component` renderer via config. In the new system:
- `component` is part of the extension's `config`
- `register()` stores the renderer in the per-editor WeakMap (same as today)
- The WeakMap pattern is already Lexical-native — no changes needed there

```ts
export function ImageExtension(userConfig?: Partial<ImageConfig>) {
  // Factory is required because component is a function reference
  const config = { disabled: false, maxWidth: 800, ...userConfig };

  return typixExtension(
    {
      name: "@typix/image",
      nodes: () => [ImageNode],
      config: safeCast<ImageConfig>(config),
      build(_editor, config) { return namedSignals(config); },
      register(editor, _config, state) {
        if (config.component) _setImageRenderer(editor, config.component);
        // ... register INSERT_IMAGE_COMMAND handler
      },
    },
    {
      commands: {
        insertImage: INSERT_IMAGE_COMMAND,
        setImageAlignment: TYPIX_SET_IMAGE_ALIGNMENT,
        // ...
      },
    }
  );
}
```

### 4.4 Pattern D: Extensions with no Typix commands

**Applies to**: auto-link, character-limit, max-length, keywords, markdown-shortcuts, tab-focus, draggable-block

These are purely behavioral — no chain API commands. They become plain Lexical extensions with no Typix metadata:

```ts
export const TabFocusExtension = defineExtension({
  name: "@typix/tab-focus",
  register(editor) {
    return editor.registerCommand(KEY_TAB_COMMAND, ...);
  },
});
// No typixExtension() wrapper needed — no commands, no shortcuts
```

### 4.5 Pattern E: StarterKit (composition extension)

```ts
export function StarterKit(options?: StarterKitOptions) {
  const bold = options?.bold === false ? null : BoldExtension;
  const italic = options?.italic === false ? null : ItalicExtension;
  const heading = HeadingExtension(typeof options?.heading === 'object' ? options.heading : {});
  // ... all sub-extensions

  const deps = [bold, italic, heading, ...].filter(Boolean);

  const ext = defineExtension({
    name: "@typix/starter-kit",
    dependencies: deps,
  });

  // Merge metadata from all sub-extensions
  const mergedMeta = mergeTypixMeta(deps);
  registerTypixMeta(ext, mergedMeta);

  return ext;
}
```

### 4.6 Full extension migration checklist

| Extension | Pattern | Has Commands | Has Shortcuts | Has Nodes | Notes |
|-----------|---------|:---:|:---:|:---:|-------|
| bold | A (static) | toggleBold | Mod+B | - | |
| italic | A (static) | toggleItalic | Mod+I | - | |
| underline | A (static) | toggleUnderline | Mod+U | - | |
| strike | A (static) | toggleStrike | Mod+Shift+S | - | |
| subscript | A (static) | toggleSubscript | - | - | |
| superscript | A (static) | toggleSuperscript | - | - | |
| highlight | A (static) | toggleHighlight | - | - | |
| code | A (static) | toggleCode | - | - | |
| heading | B (factory) | toggleHeading | - | HeadingNode | levels config |
| blockquote | B (factory) | toggleBlockquote | - | QuoteNode | |
| list | B (factory) | toggleBulletList, toggleNumberList, toggleCheckList | - | ListNode, ListItemNode | |
| alignment | B (factory) | setAlignment | - | - | values config |
| link | B (factory) | setLink, unsetLink | - | LinkNode | validateUrl config |
| history | B (factory) | undo, redo | Mod+Z, Mod+Shift+Z | - | |
| font-size | B (factory) | setFontSize | - | - | |
| font-family | B (factory) | setFontFamily | - | - | |
| text-color | B (factory) | setTextColor | - | - | |
| direction | B (factory) | setDirection | - | - | |
| image | C (decorator) | insertImage, setImageAlignment, toggleImageCaption, deleteImage, duplicateImage | - | ImageNode | component config |
| collapsible | C (decorator) | insertCollapsible | - | 3 nodes | component config |
| table | B (factory) | insertTable | - | 3 nodes | merging config |
| code-block | B (factory) | insertCodeBlock, setCodeLanguage, copyCode, deleteCodeBlock | - | CodeNode, CodeHighlightNode | |
| code-block-prettier | B (factory) | formatCode | - | - | |
| mention | B (factory) | insertMention | - | MentionNode | trigger config |
| slash-command | B (factory) | openSlashCommand | - | - | |
| speech-to-text | B (factory) | startSpeechToText, stopSpeechToText | - | - | |
| auto-link | D (no cmds) | - | - | - | |
| auto-complete | B (factory) | acceptSuggestion | - | - | |
| character-limit | D (no cmds) | - | - | - | |
| max-length | D (no cmds) | - | - | - | |
| keywords | D (no cmds) | - | - | KeywordNode | |
| markdown-shortcuts | D (no cmds) | - | - | - | |
| tab-focus | D (no cmds) | - | - | - | |
| draggable-block | D (no cmds) | - | - | - | |
| drag-drop-paste | B (factory) | - | - | - | exports INSERT_IMAGE_COMMAND |
| starter-kit | E (composition) | all sub-ext commands | all sub-ext shortcuts | - | |

---

## Phase 5: Update React Adapter

> **Goal**: `EditorRoot` and `TypixEditorProvider` accept `AnyLexicalExtension[]`.

### 5.1 Update `EditorRoot` props:
```ts
interface EditorRootProps {
  extensions?: AnyLexicalExtension[]  // Was TypixExtensionDefinition[]
  extension?: AnyLexicalExtension     // Pre-built root extension (escape hatch)
  namespace?: string
  theme?: EditorThemeClasses
  // ...
}
```

### 5.2 Update `TypixEditorProvider`:
```ts
function TypixEditorProvider({ children, extensions = [] }) {
  const [lexicalEditor] = useLexicalComposerContext()

  const editor = useMemo(() => {
    const registry = new ExtensionRegistry()
    for (const ext of extensions) {
      registry.register(ext)  // Reads TypixMeta from WeakMap
    }
    return new TypixEditor(lexicalEditor, registry, "typix-react")
  }, [lexicalEditor])

  return <TypixEditorContext.Provider value={{ editor }}>{children}</TypixEditorContext.Provider>
}
```

### 5.3 Update `EditorRoot` extension building:
```ts
const rootExtension = useMemo(() => {
  if (extension) return extension;
  return defineExtension({
    name: "typix/root",
    namespace,
    theme,
    dependencies: extensions,  // Direct — no .typix extraction
  });
}, [extension, namespace, theme]);
```

### Files to modify:
- `packages/react/src/editor-root/index.tsx`
- `packages/react/src/editor-context.tsx`

---

## Phase 6: Update Consumers

### 6.1 Playground (`apps/playground`)

```ts
// Before
const extensions = [
  StarterKit(),
  ImageExtension({ component: imageRenderer }),
  // ...
];
const rootExtension = defineExtension({
  dependencies: extensions.map((e) => e.typix),  // ← .typix extraction
});

// After
const extensions = [
  StarterKit(),
  ImageExtension({ component: imageRenderer }),
  // ...
];
const rootExtension = defineExtension({
  dependencies: extensions,  // ← Direct, they ARE Lexical extensions
});
```

### 6.2 Docs site (`apps/typix`)

Same pattern — remove `.typix` extraction.

### 6.3 Storybook

Update any stories that use extensions.

---

## Phase 7: Clean Up & Deprecation

### 7.1 Remove dead code:
- `defineTypixExtension()` function
- `TypixExtensionDefinition` interface
- `CommandFunction`, `CommandHandler`, `CommandContext`, `BuiltinCommands` types
- `configExtension` re-export from `packages/core/src/editor/extension/index.ts` (if replaced by meta-aware version)

### 7.2 Update public API exports:
```ts
// packages/core/src/index.ts

// Remove:
export { defineTypixExtension } from './editor/extension'

// Add:
export { typixExtension, registerTypixMeta, getTypixMeta, configExtension } from './meta'
export type { TypixMeta, TypixCommandMap, TypixShortcut } from './meta'
```

### 7.3 Update package.json peer dependencies:
Ensure `lexical` and `@lexical/extension` are peer dependencies (not bundled).

---

## Execution Order

```
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4  →  Phase 5  →  Phase 6  →  Phase 7
 meta       types       engine      extensions    react       consumers    cleanup
 system     cleanup     refactor    (all ~30)     adapter     (apps)       & docs
```

**Phases 1-3** can be developed together (core infrastructure).
**Phase 4** is the bulk of the work (~30 extensions, but most follow the same pattern).
**Phases 5-6** are straightforward once Phase 4 is done.
**Phase 7** is cleanup.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| **Breaking change for consumers** | This is a major version bump. Document migration guide clearly. The consumer API change is minimal (remove `.typix` extraction). |
| **`configExtension()` loses metadata** | Our custom `configExtension()` wrapper propagates metadata from the WeakMap. Test this thoroughly. |
| **Chain API breaks** | Chain API dispatch changes from calling pre-bound handlers → dispatching Lexical commands. Same DX, different internals. Test all chain commands. |
| **Decorator node renderers** | WeakMap renderer pattern is already Lexical-native. No change needed for image/collapsible renderers. |
| **StarterKit metadata merging** | `mergeTypixMeta()` utility collects metadata from all sub-extensions. Need to handle conflicts (duplicate command names). |
| **React adapter compat** | `LexicalExtensionComposer` already accepts `LexicalExtension`. The change is removing `.typix` extraction — straightforward. |
| **Extensions with `onCreated`** | Move this logic into `register()`. Lexical's `register()` runs after editor creation — same timing. |
| **Signal reactivity** | No change — signals/effects are Lexical-native (`@lexical/extension`). They work the same way. |

---

## Verification Checklist

After each phase, verify:

- [ ] `pnpm typecheck` passes across all packages
- [ ] `pnpm build` succeeds for core, react, all extensions
- [ ] `pnpm test` passes
- [ ] Playground works end-to-end (all formatting, images, tables, etc.)
- [ ] Chain API works: `editor.chain().toggleBold().run()`
- [ ] Can API works: `editor.can().toggleBold().run()`
- [ ] Shortcuts work (Mod+B, Mod+I, etc.)
- [ ] Config override works: `configExtension(BoldExtension, { disabled: true })`
- [ ] Image extension with component renderer works
- [ ] StarterKit bundles all sub-extension commands
- [ ] A plain Lexical app can import and use a Typix extension WITHOUT Typix core

---

## Consumer Migration Guide (for CHANGELOG)

```md
## Breaking Changes

### Extensions are now native Lexical extensions

Before:
```ts
import { BoldExtension } from '@typix/starter-kit'

// BoldExtension() returned a TypixExtensionDefinition
const ext = BoldExtension()
ext.typix  // ← had to extract Lexical extension
```

After:
```ts
import { BoldExtension } from '@typix/starter-kit'

// BoldExtension IS a Lexical extension (or a factory returning one)
// No .typix extraction needed
const ext = BoldExtension  // static, or BoldExtension() for config

// Works in ANY Lexical app, with or without Typix:
buildEditorFromExtensions(defineExtension({ dependencies: [ext] }))
```

### Config customization uses `configExtension()`

Before:
```ts
BoldExtension({ disabled: true })  // Factory with config
```

After:
```ts
import { configExtension } from '@typix-editor/core'
configExtension(BoldExtension, { disabled: true })

// Or for extensions that still have factories:
HeadingExtension({ levels: [1, 2, 3] })  // Still works, returns LexicalExtension
```

### `createTypix` accepts Lexical extensions directly

Before:
```ts
createTypix({ extensions: [BoldExtension(), LinkExtension()] })
// extensions was TypixExtensionDefinition[]
```

After:
```ts
createTypix({ extensions: [BoldExtension, LinkExtension()] })
// extensions is AnyLexicalExtension[]
```
```
