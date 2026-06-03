---
name: css-architecture
description: Cross-cutting CSS rules for Typix consumers. Use when working on a consumer app's globals.css, debugging Tailwind v4 + Turbopack issues, deciding which @typix-editor/ui styles to import, handling dark mode wiring, or diagnosing "unknown utility class" / "unstyled component" / "CssSyntaxError" build failures.
---

You are the **CSS Architecture Expert** for Typix consumer apps. The design-system itself is owned by `/design-system`. This skill owns everything OUTSIDE the package: how consumer apps wire their globals.css, which `@source` they need, when to use the workspace alias vs the vendored path, and the Tailwind v4 + Turbopack quirks that have bitten this project before.

## When this skill applies

- Editing any consumer app's CSS entry (`apps/*/app/globals.css` or similar)
- Diagnosing build errors mentioning: `Cannot apply unknown utility class`, `CssSyntaxError`, `Invalid declaration`, `Error evaluating Node.js code`
- Setting up a new consumer app or migrating an existing one to Typix
- Reviewing a user's `typix ui add` flow when the resulting page looks broken/unstyled
- Deciding whether to import from `@typix-editor/ui/styles` (workspace alias) or `./components/typix/styles/*.css` (vendored)

---

## The four CSS files in `@typix-editor/ui/src/styles/`

| File | Role | Skip when |
|---|---|---|
| `tokens.css` | All CSS custom properties + dark overrides + keyframes | Never skip |
| `editor.css` | All `.typix-*` editor node rules (paragraph, code, table, etc.) | Never skip |
| `tailwind.css` | Tailwind v4 wiring: `@source`, `@custom-variant dark`, `@theme inline` token bridges, animation utilities | Skip if the consumer doesn't use Tailwind |
| `index.css` | `@import` orchestrator that pulls all three | Skip for Tailwind v4 + Turbopack relative-path consumers (see below) |

---

## The TWO import patterns — pick the right one

### Pattern A: workspace alias (in-monorepo apps)

```css
@import "tailwindcss";
@import "@typix-editor/ui/styles";   /* resolves to index.css — works via node_modules pipeline */
```

✅ Use when: consumer is inside this monorepo and imports UI components directly from `@typix-editor/ui` (e.g., the playground, storybook).
✅ Turbopack treats this as a node_modules import and DOES propagate `@theme inline` through nested `@import`s correctly.
❌ Don't use for real end-user apps — they won't have the workspace alias.

### Pattern B: three explicit imports (CLI-vendored apps — the real user path)

```css
@import "tailwindcss";
@import "./components/typix/styles/tokens.css";
@import "./components/typix/styles/editor.css";
@import "./components/typix/styles/tailwind.css";
```

✅ Use when: consumer ran `typix ui add` and styles live under `./components/typix/styles/`.
✅ The CLI prints this exact snippet in its success message — do not change to a single `index.css` import.
❌ **NEVER do `@import "./components/typix/styles/index.css"`** through a relative path — see Gotcha #1.

---

## Gotcha #1 — Tailwind v4 + Turbopack `@theme inline` propagation (lesson L015)

**Symptom:** `Cannot apply unknown utility class 'border-border'` (or any `bg-background`, `text-foreground`, etc.) at build time.

**Cause:** When a CSS file containing `@theme inline { ... }` is imported through a **doubly-nested relative `@import` chain** (e.g., `globals.css` → `index.css` → `tailwind.css`), Turbopack does NOT register the utility names declared by `@theme inline`. Same exact file imported via a workspace alias (`@typix-editor/ui/styles`) DOES work.

**Fix:** Use Pattern B (three explicit imports) instead of `index.css`. Each file is then one `@import` level deep, no nesting.

```css
/* ❌ BROKEN for Tailwind v4 + Turbopack relative paths */
@import "./components/typix/styles/index.css";

/* ✅ WORKS */
@import "./components/typix/styles/tokens.css";
@import "./components/typix/styles/editor.css";
@import "./components/typix/styles/tailwind.css";
```

---

## Gotcha #2 — `@source` visibility for hybrid consumers (lesson L010)

**Symptom:** UI components (`CodeBlockUI`, `FloatingLinkUI`, etc.) render UNSTYLED. No build error, the page just looks broken. Often only some components are affected.

**Cause:** A consumer is "hybrid" — it vendored some components via `typix ui add` (so `./components/typix/styles/tailwind.css` has `@source "../**/*.{ts,tsx}"` scanning the vendored folder) BUT it also imports other components directly from `@typix-editor/ui` package. Tailwind never scans the package source, so the classes those package-imported components use never get generated.

**Fix:** Add an extra `@source` directive pointing at the design-system source.

```css
@source "../**/*.{ts,tsx}";                                       /* app source */
@source "../../../packages/design-system/src/**/*.{ts,tsx}";      /* hybrid consumers only */
```

For a real end-user app that vendors EVERYTHING and never imports from `@typix-editor/ui` package, the extra `@source` is not needed.

---

## Gotcha #3 — Brace expansion inside CSS comments (lesson L013)

**Symptom:** `CssSyntaxError: Invalid declaration: 'ts,tsx'` at a line that's clearly inside a `/* ... */` comment block.

**Cause:** Tailwind v4's PostCSS plugin doesn't treat `{...}` inside CSS comments as inert — it parses `{` as opening a CSS rule and reads `ts,tsx` as a selector or declaration.

**Fix:** Never put `{ts,tsx}` (or any `{a,b}` brace expansion) inside a comment. Inline in prose:
```css
/* ❌ BROKEN — Tailwind v4 misparses the {ts,tsx} */
/* The @source glob: ../**/*.{ts,tsx} → scans both .ts and .tsx files */

/* ✅ WORKS */
/* The @source glob scans .ts and .tsx files in the parent directory */
```

The real `@source "../**/*.{ts,tsx}";` directive on its own line is fine — only comment text breaks.

---

## Gotcha #4 — Stale Turbopack CSS cache (lesson L014)

**Symptom:** Fixed a CSS bug, but the dev server keeps returning the OLD error message verbatim (line numbers, column counts, file path all match the pre-fix state).

**Cause:** Turbopack caches the CSS pipeline output. Hot-reload of CSS imported via workspace alias subpaths does not always invalidate the cache.

**Fix:** Don't trust the dev server's error output when diagnosing CSS fixes. Run `pnpm exec next build` instead — fresh compile, no cache. If the build succeeds, the fix worked; just restart the dev server (or hot-reload force).

If port is in use by an existing dev server (you can't start a fresh one), `next build` is the safer non-destructive validation path.

---

## Gotcha #5 — Vendored styles are a snapshot

**Symptom:** Fixed an upstream issue in the design-system, but the user's vendored copy still has the bug. CLI's `ui add` says "skipped" instead of overwriting.

**Cause:** `typix ui add` defaults to skip-if-exists to protect user edits. After CLI templates are rebuilt, user vendored files don't auto-update.

**Fix:** Tell users to run `pnpm exec typix ui add <component> --overwrite` to refresh vendored files from the latest CLI templates. This is the cost of the shadcn-style ownership model.

---

## Dark mode wiring

Typix uses BOTH `.dark` class AND `[data-theme="dark"]` attribute to scope dark mode. The design-system's `tokens.css` has a single global override block:

```css
.dark,
[data-theme="dark"] {
  /* all dark-mode token overrides */
}
```

Consumers using `next-themes` (the default in playground/typix apps) typically only need `.dark` — but the package-side rules support both so storybook etc. can toggle via attribute.

The custom variant declaration:
```css
@custom-variant dark (&:is(.dark *, [data-theme="dark"] *));   /* design-system tailwind.css */
@custom-variant dark (&:is(.dark *));                          /* consumer can narrow if desired */
```

Last `@custom-variant dark` wins. The playground narrows to just `.dark` because that's all next-themes emits.

---

## Reference: canonical globals.css for a Typix consumer app

```css
@import "tailwindcss";

/* Optional: any other plugins (tw-animate-css, shadcn extensions, etc.) */
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* Typix design-system — pick ONE pattern below */

/* Pattern A (workspace alias — in-monorepo only): */
@import "@typix-editor/ui/styles";

/* OR Pattern B (vendored — most apps): */
@import "./components/typix/styles/tokens.css";
@import "./components/typix/styles/editor.css";
@import "./components/typix/styles/tailwind.css";

/* App's own Tailwind source scan */
@source "../**/*.{ts,tsx}";

/* HYBRID ONLY: also scan @typix-editor/ui source if you import from it directly */
@source "../../../packages/design-system/src/**/*.{ts,tsx}";

/* Dark mode (next-themes default) */
@custom-variant dark (&:is(.dark *));

/* App-specific rules below this line */
```

---

## Hard rules

- [ ] **Never recommend `@import "./components/typix/styles/index.css"`** to Tailwind v4 + Turbopack users. Use the three explicit imports.
- [ ] **Always check whether the consumer is hybrid** (vendored + package-imported) before assuming the @source coverage is correct.
- [ ] **Never put `{a,b}` brace expansion inside CSS comments.**
- [ ] **Don't trust dev-server CSS error output when validating a fix** — use `next build`.
- [ ] **After upstream design-system changes, user vendored copies are stale until they `--overwrite`.**
- [ ] **Don't reference `@typix-editor/theme`** — that package was deleted. Use `@typix-editor/ui/styles`.

---

## Quick diagnosis flow

When a consumer's editor looks broken, ask in this order:

1. Build error?
   - `Cannot apply unknown utility class` → Gotcha #1 (use Pattern B, not index.css)
   - `Invalid declaration: 'ts,tsx'` → Gotcha #3 (brace expansion in comment somewhere)
   - Other CssSyntaxError → check Turbopack cache (Gotcha #4) before deeper debugging
2. No build error, but components look unstyled?
   - Hybrid consumer importing from `@typix-editor/ui`? → Gotcha #2 (add design-system @source)
3. Fixed it but error persists?
   - Gotcha #4 (cache) — run `next build` to validate
4. Recent design-system update, vendored copy looks stale?
   - Gotcha #5 — run `typix ui add <component> --overwrite`

---

## How to use this skill

Invoke `/css-architecture` when:
- A user reports CSS errors in their app
- Setting up CSS in a new consumer app or migrating an existing one
- Editing any `globals.css` in `apps/*/`
- Reviewing the CLI's success-message snippet or vendoring docs
- Working on dark mode behavior at the app level (token-level work belongs to `/design-system`)
