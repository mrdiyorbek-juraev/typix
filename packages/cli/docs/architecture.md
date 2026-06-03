# Architecture

How the Typix CLI is put together and the design decisions behind it.

## Goals

1. **Two install models that don't bleed.** Extensions are npm packages. UI components are vendored source. Each gets its own clean command surface.
2. **Predictable.** Default to printing snippets and asking before changing user code. No magical AST rewrites of files we don't own.
3. **Polished output.** Match the heroui/T3-stack visual quality with `@clack/prompts`.
4. **Fast iteration.** A flagship surface — should be tightly maintained, well tested, well documented.

## Non-goals

- We do not auto-edit user editor files (no AST rewrites of `components/typix/editor.tsx`).
- We do not invent or maintain a `typix.config.ts` file. Configuration is whatever the user does inside their `useTypixEditor({ ... })` call.
- We do not replace the user's `package.json`. We delegate every install/remove to their package manager.

---

## File layout

```
packages/cli/
├── docs/                                you are here
├── src/
│   ├── index.ts                         Commander entry (registers every command)
│   ├── commands/
│   │   ├── init.ts                      Scaffold a new project
│   │   ├── add.ts                       Install extension(s)
│   │   ├── remove.ts                    Uninstall extension(s)
│   │   ├── upgrade.ts                   Bump extension(s)
│   │   ├── list.ts                      List installed / available extensions
│   │   ├── ui/
│   │   │   ├── add.ts                   Vendor UI component(s)
│   │   │   ├── remove.ts                Delete vendored UI component(s)
│   │   │   └── list.ts                  List UI components
│   │   ├── doctor.ts                    Diagnose project issues
│   │   ├── env.ts                       Print environment info
│   │   └── agents-md.ts                 Generate AGENTS.md
│   ├── registry/
│   │   ├── extensions.ts                Catalog of installable extensions
│   │   └── ui-components.ts             Catalog of vendorable UI components + deps
│   ├── templates/
│   │   └── next-app/                    Next.js App Router template (bundled in npm package)
│   ├── lib/
│   │   ├── pkg-manager.ts               Detect npm/pnpm/yarn/bun; run install/add/remove
│   │   ├── project.ts                   Detect framework, tsconfig paths, components dir
│   │   ├── copy.ts                      Recursive copy + placeholder substitution
│   │   ├── prompts.ts                   @clack/prompts wrappers (intro, group, select, multiselect, spinner, outro)
│   │   ├── import-rewrite.ts            Rewrite @typix-editor/ui imports → local paths (for ui add)
│   │   ├── cache.ts                     30-minute cache for registry + version lookups
│   │   └── logger.ts                    Color, icons, panels
│   └── types.ts                         Shared types (ExtensionEntry, UIComponentEntry, etc.)
└── dist/                                tsup output
```

---

## The two registries

### `src/registry/extensions.ts`

The catalog of installable extensions. Each entry tells the CLI:

- The friendly name (`bold`, `image`, `mention`)
- The npm package (`@typix-editor/extension-image`)
- A one-line description shown in `typix list --available` and the interactive picker
- Snippet metadata for `typix add` to print the right `import` / `extensions: [...]` lines

```ts
export interface ExtensionEntry {
  name: string;                     // "image"
  package: string;                  // "@typix-editor/extension-image"
  description: string;
  category: "marks" | "blocks" | "nodes" | "behaviors" | "constraints" | "other";
  // Snippet generation
  snippet: {
    importName: string;             // "ImageExtension"
    isFactory?: boolean;            // true for StarterKit() (callable)
    configKeys?: readonly string[]; // ["component"] → suggests `configExtension(Ext, { component: ... })`
  };
  // For `ui add` cross-reference: extensions that pair well with a UI component
  recommendedUi?: readonly string[]; // e.g. mention → ["mention-ui"]
}
```

The registry is **bundled with the CLI npm package** — no network fetch required for the common case. A `--no-cache` flag would re-fetch from a future remote registry.

### `src/registry/ui-components.ts`

Same idea for UI components, plus dependency resolution:

```ts
export interface UIComponentEntry {
  name: string;                     // "toolbar"
  description: string;
  // Source files relative to @typix-editor/ui/src/
  files: readonly string[];
  // Other UI components needed (recursively pulled in)
  deps: readonly string[];
  // npm packages the component needs at runtime
  npmPeers: readonly string[];
  // The extension this component pairs with, if any
  extension?: string;               // e.g. "mention-ui" → extension: "mention"
}
```

---

## Design decisions

### Bundle the Next.js template inside the CLI npm package (decision A)

Versus fetching from a GitHub repo at runtime (heroui's approach) or a separate workspace package.

**Why:** simplest distribution. Works offline. The CLI version pin in `package.json` (`@typix-editor/cli@2.0.0`) also pins the template. Cost: ~50 KB to the CLI tarball, acceptable.

**Trade-off:** harder to iterate on the template independently. If the template grows beyond `next-app` (e.g., we add `vite-react`), we can revisit and move to a separate `packages/cli-templates` workspace.

### Use placeholder substitution for `init` extension picks (decision B)

The template ships with placeholders (`{{PROJECT_NAME}}`, `{{EXTENSIONS_IMPORTS}}`, `{{EXTENSIONS_ARRAY}}`). After copying, `init` replaces them based on user picks.

**Why:** clean, predictable, no string surgery. The template stays readable as a real Typix project; the placeholders are inside `.tpl` files that are processed during copy.

Files ending in `.tpl` are processed; others are copied verbatim.

### Rewrite imports inside vendored UI components (decision C)

When `typix ui add toolbar` copies files into `./components/typix/editor-ui/toolbar/`, any `from "@typix-editor/ui"` imports inside those files are rewritten to relative imports of other vendored components:

```ts
// before
import { Button } from "@typix-editor/ui";

// after
import { Button } from "../button";
```

If the dependency hasn't been vendored separately (i.e., it's a shared primitive bundled with the parent component), the import is rewritten to a local sibling file.

**Why:** vendoring is meaningless if you still need `@typix-editor/ui` as a runtime dep. shadcn does it this way.

**Implementation:** simple regex-based rewrite. We control the imports — they always come from `@typix-editor/ui` or its subpaths — so a regex is sufficient and avoids pulling in a TS AST.

### Ship a starter `<Editor />` component in the template (decision D)

The `next-app` template includes `components/typix/editor.tsx` already wired with:

- `useTypixEditor({ extensions, ... })`
- `TypixEditorContext.Provider`
- `<EditorContent editor={editor} />`
- Lifecycle hooks left as `// TODO: hook here if you want`

The user's `app/page.tsx` just renders `<Editor />`. This way users land in a working state and have a clear file to edit.

---

## How `init` works end-to-end

```
typix init my-app -t next-app -p pnpm --extensions starter-kit,image,table

1. Validate inputs (template exists, target dir empty)
2. Copy templates/next-app/  →  ./my-app/
   - Plain files: bytewise copy
   - *.tpl files: read, substitute {{PROJECT_NAME}}, {{EXTENSIONS_IMPORTS}}, {{EXTENSIONS_ARRAY}}, write WITHOUT the .tpl extension
3. Detect package manager (--package flag wins, otherwise prompt, otherwise default to npm)
4. Run `<pm> install` in ./my-app/  (skip with --no-install)
5. Print "Next steps" panel
```

Substitutions for the example above:

```
{{PROJECT_NAME}}        → my-app
{{EXTENSIONS_IMPORTS}}  → import { StarterKit } from "@typix-editor/extension-starter-kit"
                          import { ImageExtension } from "@typix-editor/extension-image"
                          import { TableExtension } from "@typix-editor/extension-table"
                          import { imageRenderer } from "@typix-editor/ui"  // when image picked
{{EXTENSIONS_ARRAY}}    → const extensions = [
                            StarterKit(),
                            configExtension(ImageExtension, { component: imageRenderer }),
                            TableExtension,
                          ]
```

Snippet generation lives in `src/registry/extensions.ts` — same code paths used by `typix add` to print snippets.

---

## How `ui add` works end-to-end

```
typix ui add bubble-menu floating-link-ui

1. Validate names (look up in ui-components registry)
2. Resolve dependency graph:
     bubble-menu       → no deps
     floating-link-ui  → ["button", "popover"]
     button            → no deps
     popover           → no deps
   → final set: [bubble-menu, floating-link-ui, button, popover]
3. Detect target dir (default ./components/typix/editor-ui/, configurable via --path)
4. For each component:
     - Copy files from @typix-editor/ui source into <target>/<component>/
     - Rewrite imports of @typix-editor/ui → relative paths
5. Aggregate npm peers across all components, dedupe
6. Detect package manager
7. Install npm peers in one call: `pnpm add lucide-react @radix-ui/react-popover`
8. Print "Done. Import from @/components/typix/editor-ui/<name>"
```

**Where do the source files come from?** Two options being considered:

- (a) Read directly from the user's `node_modules/@typix-editor/ui/src/` if installed
- (b) Bundle the source inside the CLI package (`src/templates/ui/`)

**Default: (b)** — bundle in CLI. Keeps `ui add` working without requiring `@typix-editor/ui` to be installed first. The bundled sources are pinned to the CLI's version.

---

## Package manager detection

`src/lib/pkg-manager.ts` runs these checks in order:

1. `bun.lockb` exists → bun
2. `pnpm-lock.yaml` exists → pnpm
3. `yarn.lock` exists → yarn
4. `package-lock.json` exists → npm
5. `process.env.npm_config_user_agent` parsed for the active pm
6. Fallback prompt: "Which package manager?"

`--package <pm>` always overrides detection.

Install operations use `execa` to spawn the package manager process, streaming output to the terminal so the user sees install progress in real time.

---

## Caching

Two cache layers, both with 30-minute TTL (configurable, matches heroui):

1. **Registry cache** — the bundled `registry/*.ts` is always available locally. The cache is for any FUTURE remote registry lookup (e.g., community extensions).
2. **Version lookup cache** — when `typix upgrade` queries the npm registry for latest versions, results are cached per-package.

Both bypassed with `--no-cache`. Cache files live in `<os tmp dir>/typix-cli-cache/`.

---

## Why `@clack/prompts`?

- Vite, T3, shadcn, heroui all use it — familiar UX
- Built-in support for grouped flows (the `◇ ─ ◇ ─ ◇` chain)
- Multi-select with checkboxes, proper keyboard navigation
- Smaller than `inquirer` (we shed ~150 KB)
- No prototype mutation, no global state

The legacy CLI uses `inquirer`. We're switching as part of the v2 rewrite.

---

## Why no `typix.config.ts`?

It would centralize editor configuration in a file the CLI could edit. Tempting. But:

- Users would need to read this file from their `<Editor />` and pass its contents into `useTypixEditor`. That's an indirection most teams won't want.
- Lots of editor configuration is dynamic (event handlers, components) and doesn't survive serialization to a config file.
- Encourages the "magic config CLI" pattern (think Webpack) that fails when reality doesn't match the config schema.

Instead: the source of truth is the user's `useTypixEditor({...})` call. The CLI just installs packages and prints snippets. Users own integration.

---

## Why not `typix-cli` as the npm name?

We kept `@typix-editor/cli` (scoped) for:

- Brand consistency with the rest of the `@typix-editor/*` packages
- Reserving the unscoped `typix` namespace for the editor itself or for future bare `npx typix init` (which works with `npx -p @typix-editor/cli typix init` today; we may revisit)
- npm's scoped-package permissions model is easier to manage as the project grows

The bin name is still `typix` so the daily usage is short.

---

## Testing strategy

(Defer to implementation, but planned approach:)

- **Unit:** registry resolution, snippet generation, import rewriting, package-manager detection — pure functions, easy to test with vitest
- **Integration:** `typix init my-test-app` into a temp dir, then verify file tree + dependencies — slower, run on CI
- **Snapshot:** the generated `AGENTS.md` and the rendered prompts (using `@clack/prompts` testing mode if available)

---

## Open follow-ups

Items deferred for a future revision:

- **Remote registry.** Today the extension + UI registries are bundled. A future version could fetch a curated remote registry so community extensions can show up in `typix add` without a CLI release.
- **Plugin system.** Allow third parties to publish their own CLI plugins that add new commands (e.g., `typix workflow add deploy`).
- **`typix migrate`.** A guided major-version upgrade tool that handles breaking changes (rename calls, swap imports).
- **`typix dev`.** A scoped dev server / preview tool that runs the editor in isolation for component development.
