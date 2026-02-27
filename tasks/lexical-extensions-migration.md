# Lexical Extensions Migration Plan

> **Goal:** Migrate all 17 Typix extensions from the legacy React-JSX plugin pattern to the
> new framework-agnostic Lexical Extension API (`defineExtension`), making them usable in
> React, Vue, Svelte, and vanilla JS without duplicated effort.
>
> Sources read before writing this plan:
> - https://lexical.dev/docs/extensions/intro
> - https://lexical.dev/docs/extensions/design
> - https://lexical.dev/docs/extensions/react
> - https://lexical.dev/docs/extensions/peer-dependencies
> - https://lexical.dev/docs/extensions/migration
> - https://lexical.dev/docs/extensions/included-extensions
> - facebook/lexical GitHub source (real API signatures verified)

---

## Why Migrate

| Old Pattern | New Pattern |
|---|---|
| `FC` using `useLexicalComposerContext()` | `defineExtension()` — zero React dependency |
| Nodes registered manually in `createEditorConfig()` | Extension declares its own `nodes: []` |
| Validation via runtime `useEffect` throw | Dependency graph validated before construction |
| Cannot be used outside React | Works in Vue, Svelte, vanilla JS, React |
| Props passed as JSX attributes | Type-safe `config` + `configExtension()` overrides |
| Plugins compose via JSX nesting | Extensions compose in a flat `dependencies: []` array |
| No cleanup mechanism | `register()` returns `() => void` cleanup |

---

## Correct Import Map (verified from facebook/lexical source)

```ts
// Core API — lives in the 'lexical' package itself
import {
  defineExtension,
  configExtension,        // returns [extension, config] tuple — not a new extension
  declarePeerDependency,
  safeCast,
  shallowMergeConfig,
} from "lexical";

// Builder + signals — '@lexical/extension'
import {
  buildEditorFromExtensions,   // vanilla JS editor creation
  LexicalBuilder,
  getPeerDependencyFromEditor,
  signal, effect, computed,
  namedSignals,                // converts config object to reactive signals
} from "@lexical/extension";

// React integration — '@lexical/react'
import { LexicalExtensionComposer } from "@lexical/react";
import { ReactExtension, ReactProviderExtension } from "@lexical/react";
```

---

## Complete `defineExtension` Interface

```ts
defineExtension({
  // Required — unique scoped name, e.g. "@typix/keywords"
  name: "@typix/keywords",

  // Nodes this extension needs — function to avoid circular imports
  nodes: () => [KeywordNode],

  // Default typed config
  config: safeCast<KeywordsConfig>({ /* defaults */ }),

  // Custom merge strategy (default: shallowMergeConfig)
  mergeConfig: (config, overrides) => ({ ...config, ...overrides }),

  // Always-required extensions (can wrap with configExtension)
  dependencies: [LinkExtension, configExtension(HistoryExtension, { delay: 300 })],

  // Optional/conditional cross-extension dependencies
  peerDependencies: [
    declarePeerDependency<typeof ReactExtension>("@lexical/react/React"),
  ],

  // Prevent coexistence with conflicting extensions
  conflictsWith: ["@lexical/plain-text"],

  // Lifecycle — runs in this exact order:

  // 1. init — BEFORE editor construction. Access peer configs here.
  init(editorConfig, config, state) {
    const peer = state.getPeer<typeof SomeExtension>("@typix/some");
    return { /* Init object passed to build/register via state.getInit() */ };
  },

  // 2. build — AFTER construction. Produces Output (no cleanup).
  //    Use namedSignals(config) to make config reactive at runtime.
  build(editor, config, state) {
    return namedSignals(config); // or { Component: MyReactComponent }
  },

  // 3. register — post-construction. MUST return () => void cleanup.
  register(editor, config, state) {
    const output = state.getOutput();  // result of build()
    const signal = state.getSignal();  // AbortSignal that fires on editor dispose
    return mergeRegister(
      editor.registerCommand(MY_CMD, () => true, COMMAND_PRIORITY_EDITOR),
      editor.registerNodeTransform(MyNode, transform),
    );
  },

  // 4. afterRegistration — safe to call editor.setRootElement() here
  afterRegistration(editor, config, state) {
    editor.setRootElement(document.getElementById("editor"));
    return () => editor.setRootElement(null);
  },

  // Root-only: top-level editor identity (on the app-level extension only)
  namespace: "MyEditor",
  theme: editorTheme,
  onError: console.error,
})
```

### `configExtension` — override a dependency's config

```ts
// Returns a tuple [extension, partialConfig]. Pass inside dependencies[].
const SlowHistory = configExtension(HistoryExtension, { delay: 1000 });

defineExtension({
  dependencies: [SlowHistory],
});
```

### `declarePeerDependency` — optional cross-extension wiring

```ts
peerDependencies: [
  // Type param gives TypeScript the peer's Config/Output types
  declarePeerDependency<typeof ReactExtension>("@lexical/react/React"),
],

build(editor, config, state) {
  const reactPeer = state.getPeer<typeof ReactExtension>("@lexical/react/React");
  // undefined when React is not in the extension stack — must handle both
  return reactPeer ? { Component: MyReactUIComponent } : {};
},
```

---

## React Integration

### `LexicalExtensionComposer` — replaces `LexicalComposer`

```tsx
// CRITICAL: extension prop must be referentially stable.
// Define at module scope (preferred) or useRef/useMemo — never inline.

const appExtension = defineExtension({
  name: "MyApp",
  namespace: "MyEditor",
  theme,
  dependencies: [RichTextExtension, HistoryExtension, KeywordsExtension],
});

function Editor() {
  return (
    <LexicalExtensionComposer extension={appExtension}>
      <ContentEditable className="editor" />
      <FloatingLinkComponent />   {/* Output Components placed explicitly */}
    </LexicalExtensionComposer>
  );
}
```

### Decorator pattern — auto-rendered logic-only React components

```ts
// Use for components that return null and only use useEffect
export const MyExtension = defineExtension({
  name: "@typix/my-extension",
  dependencies: [
    configExtension(ReactExtension, {
      decorators: [<MyReactPlugin key="my-extension" />],
    }),
  ],
  register(editor) {
    return editor.registerCommand(MY_CMD, handler, PRIORITY);
  },
});
// No need to place <MyReactPlugin /> in JSX — it renders automatically
```

### Output Component pattern — user-placed React UI

```ts
// Use when the component needs explicit placement (floating menus, toolbars)
export const FloatingLinkExtension = defineExtension({
  name: "@typix/floating-link",
  dependencies: [LinkExtension, ReactExtension],
  build: () => ({ Component: FloatingLinkComponent }),
  register(editor) { return registerFloatingLinkCommands(editor); },
});

// In userland:
const FloatingLink = useExtensionComponent(FloatingLinkExtension);
return <FloatingLink />;
// OR:
<ExtensionComponent lexical:extension={FloatingLinkExtension} />
```

---

## The 4 Migration Patterns

### Pattern A — Pure Logic (no UI, no React)

**Extensions:** `tab-focus`, `max-length`, `code-highlight-prism`,
`code-highlight-shiki`, `short-cuts`, `keywords`, `character-limit`

**Before (`keywords/src/extension/index.ts`):**
```tsx
export function KeywordsExtension(): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([KeywordNode])) throw new Error("...");
  }, [editor]);
  useLexicalTextEntity(getKeywordMatch, KeywordNode, $createKeywordNode);
  return null;
}
KeywordsExtension.displayName = "Typix.KeywordsExtension";
```

**After:**
```ts
import { defineExtension, safeCast } from "lexical";
import { registerLexicalTextEntity } from "@lexical/text";
import { KeywordNode, $createKeywordNode } from "../node";
import { getKeywordMatch } from "../lib";

export const KeywordsExtension = defineExtension({
  name: "@typix/keywords",
  nodes: () => [KeywordNode],
  register(editor) {
    return registerLexicalTextEntity(
      editor, getKeywordMatch, KeywordNode, $createKeywordNode,
    );
  },
});
```

What changed: all React imports removed, `useLexicalTextEntity` (hook) replaced with
`registerLexicalTextEntity` (imperative), nodes auto-registered via `nodes:`,
`hasNodes` check gone, cleanup automatic via return value.

---

### Pattern B — Thin Plugin Wrapper

**Extensions:** `link`, `auto-link`, `drag-drop-paste`

**Before (`auto-link/src/auto-link/index.tsx`):**
```tsx
export function AutoLinkExtension({ matchers = MATCHERS, onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([AutoLinkNode])) throw new Error("...");
  }, [editor]);
  return <AutoLinkPlugin matchers={matchers} onChange={onChange} />;
}
```

**After:**
```ts
import { defineExtension, safeCast } from "lexical";
import { AutoLinkNode, registerAutoLink } from "@lexical/link";

export interface AutoLinkConfig {
  matchers: LinkMatcher[];
  onChange?: ChangeHandler;
}

export const AutoLinkExtension = defineExtension({
  name: "@typix/auto-link",
  nodes: () => [AutoLinkNode],
  config: safeCast<AutoLinkConfig>({ matchers: DEFAULT_MATCHERS }),
  register(editor, { matchers, onChange }) {
    return registerAutoLink(editor, matchers, onChange);
  },
});
```

What changed: JSX plugin component replaced with its imperative `register*` equivalent.
Props become typed `config` overridable with `configExtension()`.

---

### Pattern C — UI Extensions (floating menus, drag handles)

**Extensions:** `floating-link`, `draggable-block`, `collapsible`, `context-menu`

Split into two concerns:
1. Framework-agnostic `register()` for commands/transforms
2. React `Component` returned from `build()` for UI placement

**After (`floating-link`):**
```ts
// extension/index.ts — zero React imports
export const FloatingLinkExtension = defineExtension({
  name: "@typix/floating-link",
  config: safeCast<FloatingLinkConfig>({}),
  dependencies: [LinkExtension],
  peerDependencies: [
    declarePeerDependency<typeof ReactExtension>("@lexical/react/React"),
  ],
  build(editor, config, state) {
    const hasReact = state.getPeer("@lexical/react/React") !== undefined;
    return { Component: hasReact ? FloatingLinkComponent : null };
  },
  register(editor) {
    return registerFloatingLinkCommands(editor); // no React
  },
});

// extension/FloatingLinkComponent.tsx — React only in this file
export function FloatingLinkComponent(props: FloatingLinkConfig) {
  const { floatingAnchorElem } = useRootContext();
  return <FloatingLinkUI anchorElem={floatingAnchorElem} {...props} />;
}
```

---

### Pattern D — Complex Async Extensions

**Extensions:** `auto-complete`, `speech-to-text`, `mention`

Async/side-effect logic moves entirely into `register()`. UI in a separate React file.

**After (`mention`):**
```ts
export const MentionExtension = defineExtension({
  name: "@typix/mention",
  nodes: () => [MentionNode],
  config: safeCast<MentionConfig>({ trigger: "@", minLength: 1, maxLength: 75 }),
  register(editor, config, state) {
    const editorSignal = state.getSignal(); // fires on editor dispose
    const abort = new AbortController();

    editorSignal.addEventListener("abort", () => abort.abort(), { once: true });

    const unregister = registerMentionTypeahead(editor, config, abort.signal);
    return () => { abort.abort(); unregister(); };
  },
});
```

---

## Reactive Config with `namedSignals`

For extensions where config must change at runtime (toggle features, update limits):

```ts
import { namedSignals, effect } from "@lexical/extension";

export const CharacterLimitExtension = defineExtension({
  name: "@typix/character-limit",
  nodes: () => [OverflowNode],
  config: safeCast<CharacterLimitConfig>({ maxLength: 280, charset: "UTF-16" }),
  build(editor, config) {
    // { maxLength: Signal<280>, charset: Signal<"UTF-16"> }
    return namedSignals(config);
  },
  register(editor, config, state) {
    const signals = state.getOutput();
    return effect(() =>
      // Re-runs automatically whenever maxLength or charset signal changes
      registerCharacterLimit(editor, {
        maxLength: signals.maxLength.value,
        charset: signals.charset.value,
      })
    );
  },
});
```

---

## Changes to `packages/react`

```ts
// packages/react/src/index.ts

// New re-exports
export { LexicalExtensionComposer } from "@lexical/react";
export { configExtension, declarePeerDependency, safeCast } from "lexical";
export { buildEditorFromExtensions } from "@lexical/extension";

// Deprecate (keep for Phase 1 backward compat)
/** @deprecated Use LexicalExtensionComposer + defineExtension */
export { createEditorConfig };
/** @deprecated Each extension now declares its own nodes */
export { defaultExtensionNodes };
```

Update `EditorRoot` internally to wrap `LexicalExtensionComposer`.

---

## Backward Compatibility Strategy (Two Phases)

**Phase 1 — Dual export (non-breaking, `minor` bump):**
```ts
// keywords/src/index.ts
export { KeywordsExtension } from "./extension";    // NEW — defineExtension object
/** @deprecated Use KeywordsExtension with LexicalExtensionComposer */
export { KeywordsPlugin } from "./plugin";           // OLD — React FC shim
export { KeywordNode, $createKeywordNode } from "./node"; // unchanged
```

**Phase 2 — Remove deprecated exports (`major` bump):**
Delete `plugin/` shim directories, remove deprecated re-exports, version bump with changeset.

---

## File Structure After Migration

```
extension-name/
├── src/
│   ├── extension/
│   │   ├── index.ts            <- defineExtension (ZERO React imports)
│   │   └── Component.tsx       <- React UI only (Pattern C/D)
│   ├── plugin/
│   │   └── index.tsx           <- @deprecated shim (Phase 1 only)
│   ├── node/
│   │   └── index.ts            <- unchanged Lexical node classes
│   ├── lib/
│   │   └── index.ts            <- pure utilities, no React
│   └── index.ts                <- re-exports both
```

### `package.json` changes per extension

```json
{
  "dependencies": {
    "lexical": "workspace:*"            <- move from devDeps (needed for defineExtension)
  },
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0-0",
    "react-dom": "^18.2.0 || ^19.0.0-0"
  },
  "peerDependenciesMeta": {
    "react":     { "optional": true },  <- Pattern A/B work with zero React
    "react-dom": { "optional": true }
  }
}
```

---

## Migration Order

| # | Extension | Pattern | Notes |
|---|---|---|---|
| 1 | `tab-focus` | A | Simplest — single `KEY_TAB_COMMAND` |
| 2 | `max-length` | A | `registerMaxLength` from `@lexical/overflow` |
| 3 | `code-highlight-prism` | A | `registerCodeHighlighting()` already imperative |
| 4 | `code-highlight-shiki` | A | Same shape as prism |
| 5 | `short-cuts` | A | `KEY_DOWN_COMMAND` + format commands |
| 6 | `keywords` | A | Direct swap to `registerLexicalTextEntity` |
| 7 | `link` | B | Use Lexical's `LinkExtension` as dep |
| 8 | `auto-link` | B | `registerAutoLink` from `@lexical/link` |
| 9 | `drag-drop-paste` | B | `registerDragDropPaste` from `@lexical/utils` |
| 10 | `character-limit` | A+signals | Add `namedSignals` for reactive `maxLength` |
| 11 | `collapsible` | C | Nodes + toggle command + React Output Component |
| 12 | `context-menu` | C | Selection commands + React decorator |
| 13 | `floating-link` | C | Output Component — user places `<FloatingLinkComponent />` |
| 14 | `draggable-block` | C | Output Component — user places `<DraggableBlockComponent />` |
| 15 | `auto-complete` | D | `AutocompleteNode` + debounced server in `register()` |
| 16 | `speech-to-text` | D | MediaRecorder in `register()`, React UI separate |
| 17 | `mention` | D | Most complex — typeahead + async search + `MentionNode` |

---

## Verification Checklist (Per Extension)

- [ ] `extension/index.ts` — zero `import ... from "react"` lines
- [ ] `extension/index.ts` — zero `useLexicalComposerContext` calls
- [ ] `nodes: () => [...]` declared — no manual `hasNodes` check anywhere
- [ ] `register()` returns a single `() => void` (use `mergeRegister` for multiple)
- [ ] `configExtension(MyExt, overrides)` is TypeScript-valid
- [ ] Vanilla JS: `buildEditorFromExtensions([MyExt])` builds without error
- [ ] React: `<LexicalExtensionComposer extension={moduleScope}>` compiles
- [ ] `extension` prop is at module scope or in `useRef` — never an inline object
- [ ] Storybook examples unchanged and still render correctly
- [ ] `pnpm typecheck` passes with zero new errors
- [ ] Changeset created with correct version bump type

---

## Milestones

| Milestone | Extensions | Deliverable |
|---|---|---|
| **M1** | tab-focus, max-length, code-highlight-x2, short-cuts, keywords | 6 dual-exported, zero React in core |
| **M2** | link, auto-link, drag-drop-paste | Imperative `register*`, typed config |
| **M3** | `packages/react` | `LexicalExtensionComposer` re-export, `EditorRoot` update |
| **M4** | collapsible, context-menu, floating-link, draggable-block | Core/UI split, React Output Components |
| **M5** | character-limit (signals), auto-complete, speech-to-text, mention | Full async migration |
| **M6** | all | Remove `*Plugin` shims, major bump, changeset |

---

## Key Gotchas

1. **Stable `extension` ref** — `LexicalExtensionComposer` recreates the editor if the
   `extension` prop reference changes. Always define at module scope.

2. **`defineExtension` is an identity function** — it returns the input as-is. Its value
   is purely TypeScript inference. There is no runtime registry.

3. **`nodes` must be a function** `() => [MyNode]`, not an array literal, to prevent
   circular import issues at module load time.

4. **`configExtension` returns a tuple** `[extension, config]` — not a new extension.
   Always pass it inside `dependencies: []`, never use it standalone.

5. **`declarePeerDependency` needs a type parameter** to be useful:
   `declarePeerDependency<typeof MyExt>(MyExt.name)`. Use a type-only import of the
   peer extension to avoid runtime circular dependencies.

6. **Signals come from `@lexical/extension`** — `namedSignals`, `effect`, `signal`,
   `computed` all import from `@lexical/extension`, not from `lexical`.

7. **`register()` must return one function** — use `mergeRegister(...fns)` from
   `@lexical/utils` to combine multiple unregister callbacks into one.

8. **`afterRegistration` for DOM** — if your extension calls `editor.setRootElement()`,
   do it in `afterRegistration`, not in `register`.

9. **Experimental API** — Lexical marks this as experimental; it may evolve without a
   deprecation period. Pin `lexical` to an exact minor and review changelogs on upgrade.
