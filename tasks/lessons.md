# Lessons Learned

Rules I enforce on myself, written after corrections. Reviewed at every session start.

---

## Documentation

### L001 — Always check existing files before creating
**Trigger:** Created docs that partially duplicated existing content.
**Rule:** Before writing any doc/file, run `ls` on the target directory. If something exists, read it first and extend rather than overwrite.

### L002 — Docs folder always needs an index
**Trigger:** Created 5 doc files with no navigation between them.
**Rule:** Any `docs/` folder with 2+ files gets an `index.md` immediately. Create it in the same pass, not as an afterthought.

### L003 — Root-level docs must cross-link
**Trigger:** ARCHITECTURE.md existed but didn't reference the new `docs/` folder.
**Rule:** When adding docs, always update the nearest upstream doc (README or ARCHITECTURE) to link to the new content.

---

## Memory & Context

### L004 — MEMORY.md must stay lean and accurate
**Trigger:** MEMORY.md grew to 80+ lines with stale implementation details (e.g., old Base UI deps that were removed).
**Rule:** After each major task, audit MEMORY.md. Remove entries that are outdated. Keep only patterns confirmed to still be true.

### L005 — tasks/lessons.md must exist and be reviewed each session
**Trigger:** CLAUDE.md mandates it but the file didn't exist. Mistakes repeated as a result.
**Rule:** At session start, read this file before touching any code. After any user correction, add a rule here immediately.

---

## Task Workflow

### L006 — "Continue" means complete the obvious next step, not ask
**Trigger:** User said "continue" and expected me to infer the missing piece (index file, cross-links).
**Rule:** When a task is clearly 80% done, identify the remaining 20% and do it. Don't stop and ask.

---

## Dependencies

### L008 — Extension peerDependencies: only @typix-editor/core
**Trigger:** Extensions had `lexical` and `@lexical/*` in peerDependencies, requiring consumers to install them manually.
**Rule:** Extension `peerDependencies` contains `@typix-editor/core` only. All `@lexical/*` + `lexical` go in `devDependencies` (build-time only). Core declares all `@lexical/*` as its own peers — consumers get them transitively. Consumer needs to install only `lexical` + `@typix-editor/core`.

### L009 — When adding a new @lexical/* package to any extension, add it to core's peerDeps first
**Trigger:** `@lexical/code-shiki` and `@lexical/history` were used by extensions but missing from core's peerDependencies.
**Rule:** Before adding any `@lexical/*` to an extension's devDeps, verify it's in `packages/core/package.json` peerDependencies. If not, add it there first.

---

## Code & Architecture

### L007 — Never touch code you haven't read
**Trigger:** General principle from CLAUDE.md repeatedly violated.
**Rule:** Read the file first, always. Even for simple edits. Especially for types and exports.

### L010 — Consumer apps MUST add @source + @import for @typix-editor/ui
**Trigger:** Image component styles were completely missing — Tailwind v4 didn't generate any classes from design-system source files.
**Rule:** Any app consuming `@typix-editor/ui` components MUST have both of these in its CSS entry point:
1. `@source` pointing to `packages/design-system/src/**/*.{ts,tsx}` — so Tailwind scans and generates the classes used in design-system components.
2. `@import "@typix-editor/ui/styles"` — pulls in keyframes (`typix-image-spin`, `typix-image-fade-in`), `--typix-ui-*` design tokens, and shadcn theme tokens.
Without both, design-system components render unstyled. This is a hard requirement for Tailwind v4's source-based detection model.

### L011 — Mirror source layout to skip import rewriting
**Trigger:** Planned a full import rewriter for `typix ui add` before discovering the source uses only relative cross-folder imports (`../../primitives/button`), zero `@typix-editor/ui` bare imports.
**Rule:** When designing a "copy source code into user's project" feature, first grep for cross-package bare-specifier imports in the source. If the source uses pure relative imports, mirror the directory layout exactly in the destination — every relative path resolves identically, and no rewriter is needed. Saved an entire utility module and class of bugs (mismatched relative-path-rewrite math).

### L012 — Use native fs.rm with retries for directory deletion, not fs-extra.remove
**Trigger:** `fs.remove()` from fs-extra silently left files behind on Windows when deleting a folder during `typix ui remove` (mark-button.tsx survived). Second invocation succeeded. Classic EBUSY / file-handle race.
**Rule:** For any recursive directory delete on Windows, use Node's built-in `fs.promises.rm(path, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })`. Don't trust fs-extra's `remove()` — it doesn't retry, so any transient handle (tsc, VS Code, antivirus) can leave orphaned files with no error thrown.

### L013 — Never put `{a,b}` brace expansion inside CSS comments — Tailwind v4 PostCSS misparses it
**Trigger:** Documentation comment in `tailwind.css` showed example glob `../**/*.{ts,tsx}`. Tailwind v4's PostCSS plugin treats the `{` as a CSS rule opening and `ts,tsx` as a selector, then fails with "Invalid declaration: `ts,tsx`". Real `@source "../**/*.{ts,tsx}"` directive on a separate line is fine — but the comment example with the same braces breaks parsing.
**Rule:** When writing CSS comments that mention glob patterns, never include `{a,b}` brace expansion. Either inline the pattern in prose ("scans .ts and .tsx files") or use a different separator like `(ts|tsx)`. Affects only Tailwind v4 + PostCSS; vanilla CSS spec says comments should be ignored, so this is a parser quirk that's easy to overlook.

### L014 — Next dev/Turbopack caches CSS pipeline errors across hot reloads
**Trigger:** Fixed a CSS bug in `packages/design-system/src/styles/tailwind.css` but hitting the running playground dev server kept returning the OLD error (line numbers, columns, content all matched pre-fix state). Hot-reload of CSS imported via workspace-aliased subpath does not invalidate the Turbopack CSS pipeline cache.
**Rule:** When a CSS fix appears not to take effect, don't trust the dev-server error output. Validate with `pnpm exec next build` (fresh compile, no cache) before assuming the fix didn't work. Restarting the dev server also clears it, but `next build` is non-destructive when another instance holds the `.next/dev/lock`.

### L015 — Tailwind v4 @theme inline propagation differs between relative and node_modules @imports under Turbopack
**Trigger:** Same design-system `tailwind.css` containing `@theme inline { --color-border: var(--border); ... }` worked when imported via `@import "@typix-editor/ui/styles"` (workspace-alias / node_modules path) but failed with "Cannot apply unknown utility class `border-border`" when imported via the equivalent relative path `@import "../components/typix/styles/index.css"` (which then imports tailwind.css). Same target file, different resolution path.
**Why:** Tailwind v4 + Turbopack appears to treat node_modules CSS imports through a different pipeline that registers `@theme inline` utility declarations across nested @imports. Relative-path CSS imports do NOT propagate `@theme inline` registrations through a second level of indirection — utility names defined in `tailwind.css` aren't seen by `@apply` calls in the top-level entry.
**How to apply:** When designing a "vendor-and-import" CSS distribution model (shadcn-style), do NOT ship an `index.css` orchestrator that bundles `@theme inline` blocks via @import. Instead, instruct users to import the constituent files DIRECTLY from their app CSS entry. For Typix CLI users: the `typix ui add` success message prints the three explicit imports (`tokens.css`, `editor.css`, `tailwind.css`) rather than a single `index.css`. Keep `index.css` only for non-Tailwind consumers and for workspace-alias use.
