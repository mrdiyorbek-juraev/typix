---
name: cli-vendoring
description: Cross-cutting expert for the shadcn-style "vendor source into user project" distribution model. Use when designing or debugging anything that touches the pipeline from packages/design-system/src/* → CLI templates → user's components/typix/ folder. Spans CLI (packages/cli) and design-system (packages/design-system). Use ALONGSIDE typix-cli or design-system, not instead of them.
---

You are the **CLI Vendoring Architecture Expert**. You don't own any one package — you own the **pipeline** that ships design-system source code into end-user projects via the CLI. This skill exists because the vendoring story spans two packages and several gotchas live in the seam between them.

## When this skill applies

- Adding a new component to `packages/design-system/src/main/` or `src/primitives/` (you need to think about how it'll vendor)
- Modifying the symbol map, graph walker, or copy logic in `packages/cli/src/utils/ui-*`
- Designing new commands or flags for `typix ui *`
- Debugging "I ran `typix ui add X` but Y doesn't work in my project"
- Onboarding someone to the shadcn-style ship pattern
- Reviewing PRs that touch CLI templates or design-system source layout

For deep dives into ONE side of the pipeline, hand off to:
- `/typix-cli` — anything inside `packages/cli/`
- `/design-system` — anything inside `packages/design-system/`
- `/css-architecture` — consumer-side CSS wiring

This skill stays at the system level.

---

## The model in one paragraph

`@typix-editor/ui` (`packages/design-system`) is `"private": true` and never published to npm. At CLI-build time, its source is copied into `packages/cli/dist/templates/ui/`. End users run `typix ui add <component>` which copies files from those bundled templates into `<their-project>/components/typix/{main,primitives,lib,styles}/`. The user OWNS those files — edit, customize, delete freely. The CLI tracks nothing; it's stateless. To pull upstream changes, users re-run `typix ui add <component> --overwrite`.

---

## The pipeline (read in order)

```
                                                                     
   packages/design-system/src/                                       
   ├── main/                                                          ← Source of truth: 23 main editor components
   ├── primitives/                                                    ← 28 shadcn-style primitives  
   ├── lib/                                                           ← cn(), useControllableState, etc.
   ├── styles/{tokens,editor,tailwind,index}.css                      
   └── index.ts                                                       ← Barrel re-exporting everything
              │
              │   pnpm --filter @typix-editor/cli build
              │   tsup onSuccess hook: cpSync src/* → dist/templates/ui/*
              ▼
   packages/cli/dist/templates/ui/                                    ← Bundled snapshot inside the CLI
   ├── main/  primitives/  lib/  styles/  index.ts                    
              │
              │   typix ui add <component>
              │   (in any consumer project)
              ▼
   <consumer>/components/typix/                                       ← User-owned copy
   ├── main/<component>/                                              ← Just the picked ones + transitive deps
   ├── primitives/<name>/                                             
   ├── lib/<file>.ts                                                  
   └── styles/{tokens,editor,tailwind,index}.css                      
```

Each stage has its own ownership and lifecycle. Confusing them is the source of every vendoring bug.

---

## Cross-package invariants (the rules that span both sides)

### 1. Source must use only relative imports (no `@typix-editor/ui` bare specifiers)

Why: the CLI copies files into the user's project preserving folder layout. Relative imports like `../../primitives/button` resolve identically in the new location. A `from "@typix-editor/ui"` bare import would resolve to the user's `node_modules`, which doesn't have this package (it's private). It would also defeat the "you own the code" promise.

Verify: `grep -rn 'from "@typix-editor/ui"' packages/design-system/src/` must return zero hits (JSDoc examples don't count).

### 2. Mirror layout means no import rewriter

Because the source uses relative imports AND the CLI mirrors the folder layout, no path-rewriting is needed at copy time. This is a load-bearing simplification. If invariant #1 ever breaks, the entire `ui-copy.ts` design becomes wrong. Don't add cross-package bare imports to the design-system source — write a test to catch it.

### 3. Design-system source changes ⇒ CLI rebuild required

The CLI ships a snapshot of `packages/design-system/src/` at CLI-build time. If you edit design-system source and don't rebuild the CLI, `typix ui add` will copy the OLD version. When iterating:

```bash
# Run in two terminals:
pnpm --filter @typix-editor/design-system dev    # rebuilds design-system on change
pnpm --filter @typix-editor/cli dev              # re-snapshots templates on change
```

### 4. Vendored copies are snapshots; users must opt-in to upgrades

`typix ui add` defaults to skip-if-exists to protect user edits. After CLI templates refresh, user vendored copies don't auto-update. To pull upstream changes:

```bash
typix ui add <component> --overwrite
```

This is the shadcn cost-of-ownership tradeoff. Document it for anything that affects all users (e.g., CSS structure changes).

### 5. CSS architecture has its own propagation rules

The four-file `styles/` layout (`tokens.css`, `editor.css`, `tailwind.css`, `index.css`) is split for a reason — Tailwind v4 + Turbopack has a propagation bug for nested `@import`s with `@theme inline`. Hand off to `/css-architecture` for the full story. **Key consequence:** the CLI's `ui add` success message prints THREE explicit imports (not `index.css`). Don't change that without re-reading lesson L015.

---

## The graph walker, in plain English

`packages/cli/src/utils/ui-graph.ts` answers: "given a main component slug, what's the full set of files + npm peers + workspace peers I need to copy and install?"

**Algorithm:**
1. Seed: all files inside `main/<slug>/`
2. For each file, parse imports (regex on `import ... from "X"` and `export ... from "X"` and dynamic `import("X")`)
3. Classify each import specifier:
   - Relative (`./...`, `../...`) → resolve to file path, check if it crosses node boundary (e.g., `main/foo` → `primitives/button` is a cross), queue the new node
   - `@radix-ui/*`, `lucide-react`, `cmdk`, `clsx`, `tailwind-merge`, `class-variance-authority`, `react-day-picker`, `react-textarea-autosize` → npm peer
   - `react`, `react-dom`, `lexical`, `@typix-editor/*`, `@lexical/*` → workspace peer (consumer already has these)
   - Anything else → record as npm peer (best-effort)
4. For newly discovered nodes, recurse

A "node" is one of: a main component folder (`main/<slug>`), a primitive folder (`primitives/<slug>`), or a lib file (`lib/<slug>`). Node identity is the relative path from the templates root.

The classifications are hardcoded in `NPM_PEERS_PREFIXES`, `NPM_PEERS_EXACT`, `WORKSPACE_PREFIXES`, `WORKSPACE_EXACT` constants. When adding a new external dependency to a design-system component, update those lists OR the graph walker will misclassify.

---

## The symbol map (currently unused by the runtime, but kept)

`packages/cli/src/utils/ui-symbols.ts` parses `dist/templates/ui/index.ts` re-exports and builds a map of every exported symbol → `{kind: 'primitive'|'main'|'lib', dir, sourcePath}`.

This was originally needed because the spec assumed the source would have `from "@typix-editor/ui"` imports that need rewriting. After discovering invariant #2 (relative-only imports → no rewriter needed), the symbol map became dead code at copy time. **It's still useful** for `typix ui list --json` and any future feature that needs to answer "where does symbol X live?". Don't delete it without checking.

---

## The orphan-aware `ui remove`

When you remove a main component, the CLI re-walks the graph over the SURVIVING vendored mains to find primitives/lib that no other component still uses. Only orphans are deleted; shared deps are preserved.

This means `typix ui remove` reads the user's `components/typix/main/` to enumerate survivors, then walks their dep graphs against the same bundled templates. The graph walker is the same code path as `ui add`.

---

## Common pitfalls (cross-package)

1. **Adding a `from "@typix-editor/ui"` import in the design-system source** → breaks invariant #1, vendored files won't compile in user projects.
2. **Editing styles and forgetting to rebuild the CLI** → CLI templates stale, `--overwrite` won't refresh to the latest.
3. **Adding a new external runtime dep to a component without updating `NPM_PEERS_*` lists** → graph walker classifies it wrong, user doesn't get `npm install` prompt.
4. **Recommending `@import "...index.css"` to Tailwind v4 users via relative path** → "Cannot apply unknown utility class" build error (L015).
5. **`fs.remove` from fs-extra on Windows** → silent file-handle race, leaves orphans (L012). Use native `fs.rm` with retries.
6. **Putting `{ts,tsx}` brace expansion in CSS comments** → Tailwind v4 PostCSS misparses (L013).
7. **Trusting stale dev-server CSS errors** → cache-blind diagnosis. Use `next build` to validate fixes (L014).

---

## When designing a new component (vendoring checklist)

Before adding a new main component to `packages/design-system/src/main/`:

- [ ] Imports only `react`, `@lexical/*`, `@typix-editor/*`, or relative paths (no `@typix-editor/ui`)
- [ ] Any new external npm deps are added to `NPM_PEERS_*` constants in `packages/cli/src/utils/ui-graph.ts`
- [ ] Any new shared utility goes in `lib/` (not duplicated inside the component)
- [ ] Component has both light and dark mode styling via `tokens.css` overrides (not hardcoded)
- [ ] After source is committed: run `pnpm --filter @typix-editor/cli build` and dry-run `pnpm typix ui add <new-component> --debug` in the playground to verify the graph walker resolves it correctly
- [ ] If the dry-run is correct, real-add it and run `pnpm --filter @typix-editor/playground typecheck` to confirm vendored output compiles

---

## How to use this skill

Invoke `/cli-vendoring` when:
- Designing changes that span CLI + design-system at once
- Reviewing system-level decisions (e.g., "should we add a new `--update` command to refresh vendored files?")
- Debugging end-to-end vendoring issues
- Onboarding someone new to the shadcn ship model
- Auditing whether a recent change broke any of the cross-package invariants

For changes scoped to ONE side, hand off to `/typix-cli`, `/design-system`, or `/css-architecture`.
