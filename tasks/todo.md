# CSS Consolidation — drop `packages/theme`, all styles live in `@typix-editor/ui`

## Goal

One CSS source of truth (`packages/design-system/src/styles/`), one user import line, zero duplication. The CLI vendors styles alongside components so users own and customize them. `packages/theme` is deleted.

## End-user experience after this lands

After `typix ui add <component>`, the user adds **one line** to their CSS:

```css
@import "tailwindcss";
@import "./components/typix/styles/index.css";  /* ← everything Typix needs */
```

If they want to override a token, they just `@import` after that and redefine `--typix-color-link: red;` etc. If they want pure-CSS only (no Tailwind), they import `tokens.css` + `editor.css` directly and skip `tailwind.css`.

## Target structure

```
packages/design-system/src/styles/
├── tokens.css      ← ALL CSS custom properties + dark mode overrides
│                     - shadcn theme tokens (--background, --popover, …)
│                     - editor tokens   (--typix-color-text, --typix-bg-code, …)
│                     - UI tokens       (--typix-ui-color-*, --typix-ui-space-*, …)
│                     - keyframes (typix-cursor-blink, typix-table-controls, typix-image-*,
│                                  typix-ui-fade-in, typix-ui-scale-in, typix-ui-slide-up)
├── editor.css      ← ALL .typix-* node rules
│                     - editor shell, paragraph, text, tab
│                     - blockquote, link, code-block, code tokens, horizontal-rule
│                     - list (ol/ul/checklist/nested), table (all variants), mark, hashtag
│                     - embed-block, layout, image, indent, autocomplete, special-text,
│                       block-cursor
│                     - context-menu, mention, floating-link, draggable-block, collapsible,
│                       character-limit, keyword
├── tailwind.css    ← Tailwind v4 wiring (separate so non-Tailwind users can skip it)
│                     - @source "../**/*.{ts,tsx}"   (path resolves correctly when vendored
│                                                     to components/typix/styles/)
│                     - @custom-variant dark (...)
│                     - @theme inline { ... shadcn token bridges ... }
│                     - @layer utilities { .animate-fade-in, .animate-scale-in, … }
└── index.css       ← @import "./tokens.css"; @import "./editor.css"; @import "./tailwind.css";
```

Why this split:
- **`tokens.css`** is what users override. Splitting it from rules means an override `@import` after `index.css` only re-declares custom properties — no specificity wars.
- **`editor.css`** is purely structural. Users normally won't touch it; if they vendor and customize, they have one file to edit.
- **`tailwind.css`** is optional. A user on plain CSS / styled-components / CSS modules can skip it and the editor still works.
- **`index.css`** is the convenience door — one import, everything works.

## Plan

### Phase 1 — Build new CSS structure (no consumer changes yet)

- [ ] **Create `packages/design-system/src/styles/tokens.css`**
  - Port all token blocks from `packages/theme/scss/tokens/*.scss` (typography, colors, spacing, code-tokens, component-tokens, ui-tokens) — convert SCSS maps to flat CSS variables (the `_mixins.scss` `typix-tokens` mixin just generates `--prefix-key: value;` per map entry, mechanical conversion).
  - Move the shadcn `--background/--popover/…/--sidebar-*` tokens currently in `styles/globals.css` here.
  - Move the `--typix-ui-*` tokens currently in `styles/globals.css` here.
  - Move ALL keyframes here (currently scattered across globals.css + theme/scss/foundation/_keyframes.scss).
  - Single `:root { ... }` block, then `.dark, [data-theme="dark"] { ... }` block.
- [ ] **Create `packages/design-system/src/styles/editor.css`**
  - Port `.typix-*` rules from `packages/theme/scss/{base,nodes,components}/*.scss`.
  - Convert `@include dark-mode { ... }` (the only SCSS-only feature actually used in rule files) → flat `.dark .typix-foo, [data-theme="dark"] .typix-foo { ... }` blocks.
  - One file, organized with comment banners matching the SCSS source layout.
  - Delete the duplicate collapsible block currently in playground globals.css (lines 1455–1523 ≡ 1525–1596).
- [ ] **Rewrite `packages/design-system/src/styles/tailwind.css`**
  - Keep `@source "../**/*.{ts,tsx}"` — works both in-monorepo (scans design-system) AND after vendoring (scans the user's `components/typix/`).
  - Keep `@custom-variant dark (&:is(.dark *), &:is([data-theme="dark"] *))`.
  - Keep `@theme inline { ... }` (token → Tailwind utility name bridges).
  - Keep `@layer utilities { .animate-fade-in, .animate-scale-in, .animate-slide-up }`.
  - **Remove** `@import "tailwindcss"` — users own that import in their app's CSS entry.
  - **Remove** `@import "./globals.css"` — `index.css` orchestrates imports now.
- [ ] **Create `packages/design-system/src/styles/index.css`**
  - `@import "./tokens.css";`
  - `@import "./editor.css";`
  - `@import "./tailwind.css";`
- [ ] **Delete `packages/design-system/src/styles/globals.css`** (content split between tokens.css and editor.css already by the steps above).
- [ ] **Update `packages/design-system/package.json` exports:**
  ```json
  "./styles":          "./src/styles/index.css",
  "./styles/tokens":   "./src/styles/tokens.css",
  "./styles/editor":   "./src/styles/editor.css",
  "./styles/tailwind": "./src/styles/tailwind.css"
  ```
  (Removes the current `dist/index.css` indirection — package is private, only consumed via CLI vendoring or workspace alias.)
- [ ] **Update `packages/design-system/package.json` scripts:**
  - Drop `build:css` and the `tailwindcss -i ...` invocation in the `build`/`dev` scripts. The CSS no longer needs pre-processing — users (or vendored CLI consumers) run their own Tailwind.
  - Drop `concurrently` devDep (only used for the parallel Tailwind watch).

### Phase 2 — Update CLI to copy the whole styles folder

- [ ] **`packages/cli/src/utils/ui-copy.ts`**: replace `copyGlobalStyles` with `copyStyles` that copies the entire `styles/` directory (preserving structure). Same per-file skip-if-exists behavior.
- [ ] **`packages/cli/src/commands/ui/add.ts`**: call `copyStyles` instead of `copyGlobalStyles`. Update success message to: `Add to your CSS: @import "./components/typix/styles/index.css";`
- [ ] **`packages/cli/tsup.config.ts`**: already copies `styles/` recursively — no change needed; verify after Phase 1.

### Phase 3 — Migrate in-repo consumers, then delete `packages/theme`

- [ ] **`apps/playground/app/globals.css`**: gut the ~1500-line dupe. Keep only:
  - `@import "tailwindcss";`
  - `@import "@typix-editor/ui/styles";` (workspace alias, resolves to `src/styles/index.css` via package exports)
  - The 3 app-specific rules at the bottom (`html,body{overflow:hidden;height:100%}`, `::selection`, the `@layer base` `body` reset).
- [ ] **`apps/storybook/.storybook/preview.ts`**: replace `import "@typix-editor/theme"` with `import "@typix-editor/ui/styles"`.
- [ ] **`apps/typix/package.json`**: remove `@typix-editor/theme` (it's listed but not imported anywhere — leftover dep).
- [ ] **`apps/playground/package.json` & `apps/storybook/package.json`**: remove `@typix-editor/theme`.
- [ ] **Run `pnpm install`** to update the lockfile.
- [ ] **Delete `packages/theme/`** entirely.
- [ ] **Remove `packages/theme` from `pnpm-workspace.yaml`** if listed explicitly (workspace globs may make this a no-op).
- [ ] **Search & destroy** any remaining `@typix-editor/theme` references — `grep -rn "@typix-editor/theme"` should return zero hits.

### Phase 4 — Verify

- [ ] `pnpm install` clean (no missing peer warnings about theme).
- [ ] `pnpm --filter @typix-editor/cli build` succeeds, `dist/templates/ui/styles/` contains the 4 new files.
- [ ] `pnpm --filter @typix-editor/playground dev` — open in browser, visually verify editor renders identical (text, headings, lists, code blocks, tables, mention, collapsible, draggable, all themed nodes look the same in light + dark).
- [ ] `pnpm --filter @typix-editor/playground typecheck` clean.
- [ ] `pnpm --filter @typix-editor/storybook dev` — same visual check.
- [ ] In playground: `pnpm typix ui add mark-button` — copies 4 files to `components/typix/styles/` and the user-instruction at the end says `@import "./components/typix/styles/index.css";`. Manually verify the vendored editor.css `@source` path still scans correctly.

## Risks & decisions

1. **`@source "../**/*.{ts,tsx}"` after vendoring.** When `tailwind.css` is at `components/typix/styles/tailwind.css`, that glob resolves to `components/typix/**` — which is exactly the vendored components folder. ✅ Works.
2. **`@source` when consumed via workspace alias (playground in dev).** The path resolves to `packages/design-system/src/**` from `packages/design-system/src/styles/tailwind.css`. ✅ Works.
3. **SCSS → CSS dark-mode mixin conversion.** Every `@include dark-mode { ... }` becomes a flat selector duplicate. Slight increase in CSS size but no behavioral diff. Net file size will be much smaller anyway because we delete the playground duplication.
4. **Order of imports in `index.css`.** Tokens first (must define vars before they're used), then editor (consumes editor tokens), then tailwind (Tailwind v4's `@theme inline` consumes the shadcn tokens). ✅ Verified order.
5. **Pre-built dist of design-system goes away.** Anyone (none today, per grep) consuming `@typix-editor/ui/styles` as a built CSS file gets raw CSS instead. Since the package is `"private": true` and not on npm, no external impact.

## Out of scope

- Consolidating the THREE token vocabularies (`--typix-*` editor, `--typix-ui-*` primitives, shadcn `--*`) into one. That's a real design exercise; this task just relocates, doesn't redesign.
- Replacing CSS custom properties with Tailwind v4 `@theme` blocks (would let users `bg-typix-color-bg` etc. — nice but bigger scope).
- Anyone outside this repo depending on `@typix-editor/theme` — user confirmed no migration path needed.

---

## Review

### What shipped

**Phase 1** — Built new CSS structure inside `packages/design-system/src/styles/`:
- `tokens.css` (609 lines) — every CSS custom property (shadcn + `--typix-*` editor + `--typix-ui-*`) + 7 keyframes + comprehensive dark-mode overrides in a single global `.dark, [data-theme="dark"]` block
- `editor.css` (933 lines) — every `.typix-*` node rule, organized into 26 sections with comment banners. SCSS `@include dark-mode` blocks converted to flat `.dark .typix-foo, [data-theme="dark"] .typix-foo` selectors.
- `tailwind.css` — Tailwind v4 wiring only (`@source`, `@custom-variant dark`, `@theme inline` shadcn bridges, `@layer utilities` animations). No `@import "tailwindcss"` — users own that.
- `index.css` — single-line orchestrator importing the three above.
- `globals.css` deleted.
- `package.json` exports flipped to point at `src/styles/{index,tokens,editor,tailwind}.css` (not built `dist/index.css`). `build:css` script + `concurrently` devDep removed.

**Phase 2** — CLI changes:
- `packages/cli/src/utils/ui-copy.ts` — `copyGlobalStyles` → `copyStyles` (copies whole `styles/` dir preserving structure). Added `getStylesIndexImportPath` helper.
- `packages/cli/src/commands/ui/add.ts` — success message now shows the canonical two-line setup: `@import "tailwindcss"; @import "./components/typix/styles/index.css";`
- `tsup.config.ts` already copies whole `styles/` dir — no change needed.

**Phase 3** — Migrated consumers + deleted `packages/theme`:
- `apps/playground/app/globals.css` — gutted from 1597 → 40 lines. Now imports `@typix-editor/ui/styles` via workspace alias.
- `apps/storybook/.storybook/preview.ts` — flipped `import "@typix-editor/theme"` → `import "@typix-editor/ui/styles"` (well, removed; `@typix-editor/ui/styles` was already imported on the next line).
- `package.json` — `@typix-editor/theme` removed from playground, storybook, apps/typix.
- CLI docs (`doctor.md`, `agents-md.md`, `env.md`, `init.md`, `list.md`, `upgrade.md`, `templates.md`) — all references to `@typix-editor/theme` updated to `@typix-editor/ui/styles` or `@typix-editor/ui` (package name vs. CSS import context).
- `packages/theme/` directory deleted.
- `grep -rn "@typix-editor/theme" apps/ packages/` returns **zero hits** (excluding node_modules/.next/dist).

### Verified

- `pnpm install` — clean.
- `pnpm --filter @typix-editor/ui typecheck` — clean.
- `pnpm --filter @typix-editor/ui build` — succeeds (tsup-only now, no Tailwind preprocessing step).
- `pnpm --filter @typix-editor/playground typecheck` — clean.
- `pnpm --filter @typix-editor/playground build` — full production build succeeds in 4.6s. All 8 pages prerender. CSS pipeline (Tailwind v4 + PostCSS) compiles all three of `tokens.css`, `editor.css`, `tailwind.css` end-to-end.
- `pnpm --filter @typix-editor/cli build` — succeeds, `dist/templates/ui/styles/` contains all 4 new files matching source.
- `require.resolve("@typix-editor/ui/styles")` from `apps/playground` resolves to `packages/design-system/src/styles/index.css`. Subpaths `./tokens`, `./editor`, `./tailwind` also resolve.

### The one bug found + fixed during verification

Tailwind v4's PostCSS plugin misparses brace expansion patterns (`{ts,tsx}`) **inside CSS comments** — it treats `{` as opening a CSS rule and `ts,tsx` as a selector. The real `@source "../**/*.{ts,tsx}";` directive on its own line is fine; only the comment example broke. Fixed by rewriting the comment in prose. Captured as lesson L013.

Stale dev-server-cached error compounded the diagnosis (lesson L014 — used `next build` to bypass the Turbopack cache).

### Files changed
- created: `packages/design-system/src/styles/{tokens,editor,tailwind,index}.css`
- deleted: `packages/design-system/src/styles/globals.css`, `packages/theme/` (entire package)
- modified: `packages/design-system/package.json`, `packages/cli/src/utils/ui-copy.ts`, `packages/cli/src/commands/ui/add.ts`, `apps/playground/app/globals.css`, `apps/playground/package.json`, `apps/storybook/.storybook/preview.ts`, `apps/storybook/package.json`, `apps/typix/package.json`, 7 CLI doc files
