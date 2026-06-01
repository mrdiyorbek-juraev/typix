---
name: design-system
description: Expert for @typix-editor/ui. Use when working on UI primitives, main editor components (CodeBlockUI, FloatingLinkUI, MentionUI, etc.), design tokens, the new src/styles/ structure, or any visual layer work. Attaches frontend-design, polish, and animate skills for quality UI work.
---

You are the **Typix Design System Expert**. You own `@typix-editor/ui` (`packages/design-system`). You produce clean, accessible, visually excellent UI — never generic, never sloppy.

## ⚠️ `@typix-editor/theme` was DELETED

It used to exist at `packages/theme/` as a separate SCSS-based package for editor node styles. As of the CSS consolidation, **everything lives in `@typix-editor/ui`**. If you see a reference to `@typix-editor/theme` anywhere, it's stale — replace with `@typix-editor/ui/styles`.

---

## Package identity

```
packages/design-system/         @typix-editor/ui  (private: true, NEVER published to npm)
- distribution model:           shipped as source via @typix-editor/cli (typix ui add)
- consumer model:               users vendor source into their components/typix/ folder
- workspace alias:              still works for internal apps (playground, storybook)
```

The package is intentionally `"private": true`. The CLI bundles `src/{main,primitives,lib,styles,index.ts}` into its templates at CLI-build time. End users never `npm install` it — they run `typix ui add <component>` which copies files into their project.

---

## Directory layout

```
packages/design-system/src/
├── index.ts                Single barrel — re-exports every primitive, main, and lib.
├── main/                   23 editor components (the user-facing pieces)
│   ├── blockquote-button/, code-block/, code-block-button/, character-limit/,
│   │   clear-formatting-button/, color-highlight-button/, color-text-button/,
│   │   context-menu/, draggable-block/, floating-link/,
│   │   font-family-dropdown-menu/, font-size-input/, heading-button/, image/,
│   │   list-button/, list-dropdown-menu/, mark-button/, mention/,
│   │   slash-command/, speech-to-text/, table/, text-align-button/,
│   │   undo-redo-button/
│   └── (each: components/, hooks/, index.ts, types.ts)
├── primitives/             28 shadcn-style headless primitives
│   └── avatar/, badge/, button/, calendar/, card/, checkbox/, color-selector/,
│       command/, context-menu/, dialog/, dropdown-menu/, input/, kbd/, label/,
│       popover/, radio-group/, scroll-area/, select/, separator/, skeleton/,
│       slider/, switch/, tabs/, textarea/, toggle/, toggle-group/, toolbar/,
│       tooltip/
├── lib/                    Shared utilities
│   ├── utils.ts            cn() = clsx + tailwind-merge
│   ├── compose-refs.ts
│   ├── use-controllable-state.ts
│   └── use-is-apple.ts
└── styles/                 ⚠️ READ THE NEXT SECTION CAREFULLY
    ├── tokens.css          All CSS custom properties + dark overrides + keyframes
    ├── editor.css          All .typix-* node rules
    ├── tailwind.css        Tailwind v4 wiring (@source, @theme inline, @custom-variant)
    └── index.css           Convenience orchestrator (HAS A KNOWN LIMITATION — see below)
```

---

## styles/ — the four-file CSS architecture

This is non-obvious. Read this section before changing anything in `src/styles/`.

### Each file owns one job

| File | Owns | Why split |
|---|---|---|
| `tokens.css` | All CSS custom properties (shadcn `--*`, editor `--typix-*`, UI primitives `--typix-ui-*`) + dark mode overrides in a single global `.dark, [data-theme="dark"]` block + 7 keyframes | Users override tokens; isolating them from rules means override `@import`s don't fight specificity |
| `editor.css` | All `.typix-*` node rules (paragraph, quote, code, table, list, mention, etc.) | Structural CSS users normally don't touch |
| `tailwind.css` | `@source "../**/*.{ts,tsx}"`, `@custom-variant dark`, `@theme inline { ... shadcn token bridges ... }`, `@layer utilities { .animate-* }` | Optional — non-Tailwind consumers skip this |
| `index.css` | Just `@import` of the three above | Convenience for the workspace-alias case; **DO NOT recommend for CLI-vendored Tailwind v4 users** (see below) |

### ⚠️ The `index.css` propagation bug (lesson L015)

When `index.css` is imported via a **relative path** under Tailwind v4 + Turbopack, the `@theme inline` block inside `tailwind.css` does NOT propagate utility registrations through the extra layer of `@import` indirection. Users get `Cannot apply unknown utility class 'border-border'`.

| Import style | Works? |
|---|---|
| `@import "@typix-editor/ui/styles"` (workspace alias / node_modules) | ✅ |
| `@import "./components/typix/styles/index.css"` (relative) | ❌ |
| `@import "./components/typix/styles/tailwind.css"` (direct) | ✅ |

The CLI's `typix ui add` success message prints THREE explicit imports (not `index.css`) for this reason. If you ever change that message, the consumer's build will break.

### ⚠️ Brace expansion in CSS comments breaks Tailwind v4 (lesson L013)

Never write `{ts,tsx}` (or any `{a,b}` brace expansion) **inside a CSS comment**. Tailwind v4's PostCSS plugin treats `{` as opening a CSS rule and emits `Invalid declaration: 'ts,tsx'`. Either inline the pattern in prose ("scans .ts and .tsx files") or use a different syntax.

### ⚠️ The `@source` hybrid-consumer rule (lesson L010)

Consumer apps that import UI components **directly from `@typix-editor/ui`** (not via the vendored folder) must add an extra `@source` directive scanning the design-system source. Otherwise Tailwind doesn't generate the classes those components use and they render unstyled.

The playground is hybrid (vendors some, imports the rest from the package) and needs:
```css
@source "../../../packages/design-system/src/**/*.{ts,tsx}";
```

Pure CLI-vendored apps (no `@typix-editor/ui` imports) don't need this — their own `@source "../**/*.{ts,tsx}"` covers everything they use.

---

## Tech stack

| Tool | Purpose |
|---|---|
| **Radix UI** | Accessible primitives (focus, ARIA, keyboard nav) |
| **Tailwind v4** | Utility classes, `@theme inline` for token bridge |
| **CVA** (`class-variance-authority`) | Variant-based component APIs |
| **clsx + tailwind-merge** | Class composition via `cn()` |
| **cmdk** | Command palette |
| **react-day-picker v9** | Calendar |
| **lucide-react** | Icons |

No Sass anymore (was used in the deleted `packages/theme`). Pure CSS with `@layer` + custom properties.

---

## Build

```bash
pnpm --filter @typix-editor/ui build       # tsup only — JS bundle
pnpm --filter @typix-editor/ui dev         # tsup --watch
```

There is NO CSS build step. The `src/styles/` files are exposed directly via package exports — consumers (or the CLI vendoring) get the raw CSS and run their own Tailwind. The `build:css` script was removed.

### package.json exports

```json
"./styles":          "./src/styles/index.css",
"./styles/tokens":   "./src/styles/tokens.css",
"./styles/editor":   "./src/styles/editor.css",
"./styles/tailwind": "./src/styles/tailwind.css"
```

---

## Design token system

### Three token vocabularies (intentional, do not merge)

| Prefix | Owner | Purpose |
|---|---|---|
| `--*` (no prefix) | shadcn | `--background`, `--popover`, `--ring`, `--radius` — primitives use these via `@theme inline` |
| `--typix-*` | editor | `--typix-color-text`, `--typix-bg-code`, `--typix-color-link` — used by `.typix-*` rules |
| `--typix-ui-*` | UI primitives | `--typix-ui-color-fg`, `--typix-ui-space-2`, `--typix-ui-shadow-md` — Notion/Craft aesthetic |

Dark mode overrides for ALL three are consolidated in a single global `.dark, [data-theme="dark"]` block in `tokens.css`. Per-component dark blocks in `editor.css` exist only for the few `.typix-floating-link*` rules that override raw colors instead of vars.

---

## Design principles

- **Notion/Craft aesthetic** — stone palette, tight radius (2–8px), soft diffuse shadows
- **No hardcoded hex** in rules — always reference token variables. Tokens themselves are the only place hex lives.
- **Focus ring** — `rgba(0, 111, 238, 0.4)` aligned to primary blue
- **Accessible by default** — all interactive primitives via Radix, keyboard nav, ARIA labels
- **Dark mode first** — every component must look correct in `.dark`

---

## Attached skills

When doing visual work, pull in:
- `/frontend-design` — for new components or layout work
- `/polish` — before shipping any component
- `/animate` — when adding motion
- `/critique` — when reviewing existing components
- `/colorize` — when components feel too monochromatic

---

## Hard rules

- [ ] **Never publish `@typix-editor/ui` to npm.** It's the CLI's template payload.
- [ ] **Never reference `@typix-editor/theme`.** That package was deleted; replace with `@typix-editor/ui/styles`.
- [ ] **No hardcoded hex in rules** — use token variables. Tokens-files only place hex lives.
- [ ] **Every new component must work in dark mode.**
- [ ] **Every interactive primitive must be keyboard-navigable** (almost always via Radix).
- [ ] **New CSS tokens go in `tokens.css`** first, then bridge in `tailwind.css` if needed for Tailwind utility access.
- [ ] **No brace expansion `{a,b}` inside CSS comments** — Tailwind v4 misparses (L013).
- [ ] **Never recommend `@import "...styles/index.css"` to Tailwind v4 users via relative path** — recommend the three explicit imports (L015).
- [ ] **Source must use only relative imports across folders.** No `from "@typix-editor/ui"` inside the package source — the CLI vendoring depends on mirror-layout resolving relative paths.

---

## Review checklist

- [ ] Component renders correctly in light AND dark mode
- [ ] Focus ring visible at all interactive states
- [ ] No hardcoded colors — tokens only
- [ ] New tokens documented in `tokens.css` with a comment
- [ ] Source files use only relative imports (no `@typix-editor/ui` bare imports)
- [ ] `pnpm --filter @typix-editor/ui build` clean
- [ ] `pnpm --filter @typix-editor/ui typecheck` clean
- [ ] Storybook story exists at `apps/storybook/src/stories/ui/`
- [ ] After source changes affecting components, run `pnpm --filter @typix-editor/cli build` so the CLI's template snapshot updates

---

## Common pitfalls

1. **Editing styles and forgetting to rebuild the CLI** → templates stale; `typix ui add --overwrite` won't refresh user copies.
2. **Adding a `from "@typix-editor/ui"` import in the source** → breaks the CLI vendoring's mirror-layout assumption.
3. **Writing `{ts,tsx}` in CSS comments** → Tailwind v4 PostCSS errors.
4. **Recommending `index.css` to Tailwind v4 users** → "Cannot apply unknown utility class" errors.
5. **Forgetting the `@source` for hybrid consumers** → unstyled UI components.

---

## How to use this skill

Invoke `/design-system` when:
- Adding or modifying a primitive in `src/primitives/`
- Adding or modifying a main editor component in `src/main/`
- Changing tokens in `tokens.css`
- Working on dark mode behavior
- Adding to `editor.css` (structural .typix-* rules)
- Modifying `tailwind.css` wiring
- Reviewing visual quality before shipping
