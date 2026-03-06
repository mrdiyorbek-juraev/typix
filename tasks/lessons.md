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
