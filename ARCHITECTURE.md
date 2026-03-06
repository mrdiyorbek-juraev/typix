# Typix Architecture

> **Detailed docs:** [docs/index.md](./docs/index.md)
> — [Lexical](./docs/lexical.md) · [Core](./docs/core.md) · [Extensions](./docs/extensions.md) · [Design System](./docs/design-system.md) · [Adapters](./docs/adapters.md)

## Overview

Typix is a layered editor framework built on top of Meta's [Lexical](https://lexical.dev). The architecture is designed to be framework-agnostic at its core, progressively enhanced with a design system and extensions, then bound to specific UI frameworks via thin adapters.

```
┌─────────────────────────────────────────┐
│                  Lexical                │  ← Foundation (Meta)
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│                   Typix                 │  ← Framework wrapper
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│               Typix Core                │  ← @typix-editor/core
│                                         │
│  • TypixEditor class (high-level API)   │
│  • createTypixEditor() factory          │
│  • Event emitter (Lexical → adapters)   │
│  • Re-exports Lexical extension APIs    │
└──────────┬──────────────────┬───────────┘
           │                  │
┌──────────▼──────────┐  ┌────▼──────────────────────────────────┐
│  Typix Extensions   │  │           Design System               │
│      (Core)         │  │        @typix/design-system           │
│                     │  │                                       │
│  Typix-specific     │  │  • Theme presets / Tailwind classes   │
│  extensions that    │  │  • Default styling for all nodes      │
│  add value beyond   │  │  • Dark / light mode                  │
│  what Lexical ships │  │  • Typography scales                  │
└──────────┬──────────┘  │  • Component tokens                   │
           │             └────────────────────┬──────────────────┘
           └──────────────────────┬───────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                          All Features                           │
│         (Extensions + Design System composed together)          │
└──────────┬──────────────────────┬──────────────────────┬────────┘
           │                      │                      │
┌──────────▼──────────┐  ┌────────▼────────┐  ┌─────────▼────────┐
│    React Adapter    │  │   Vue Adapter   │  │  Svelte Adapter  │
│  @typix-editor/react│  │ @typix-editor/  │  │ @typix-editor/   │
│                     │  │      vue        │  │    svelte        │
└─────────────────────┘  └─────────────────┘  └──────────────────┘
```

---

## Layer Breakdown

### 1. Lexical (Foundation)

Lexical is the underlying editor engine by Meta. It handles:
- The editor state model (immutable, serializable)
- Node system (text, element, decorator nodes)
- Command dispatch / listener registration
- DOM reconciliation

Typix does **not** fork or patch Lexical — it wraps it.

---

### 2. Typix (`@typix-editor/core`)

The core package is the single source of truth for editor logic. It is **headless and zero-React** — pure TypeScript on top of Lexical.

**Responsibilities:**
- `TypixEditor` class — high-level API wrapper around `LexicalEditor`
- `createTypixEditor()` factory — opinionated editor instantiation
- Event emitter — bridges Lexical's internal dispatch to framework adapter subscriptions
- Re-exports all Lexical extension APIs so adapters don't need to import Lexical directly

**Package:** `packages/core`
**npm:** `@typix-editor/core`

---

### 3. Typix Extensions (Core)

Modular, self-contained feature packages that extend the editor beyond what Lexical provides out of the box. Each extension is an independent package.

**Examples:**
- `@typix-editor/rich-text` — headings, lists, quotes, code blocks
- `@typix-editor/link` — link nodes + auto-link detection
- `@typix-editor/image` — image node + upload handling
- `@typix-editor/table` — table node with resizing and selection
- `@typix-editor/markdown-shortcuts` — inline markdown-to-rich-text transforms
- `@typix-editor/code-highlight-shiki` — syntax highlighting via Shiki
- `@typix-editor/drag-drop-paste` — file drag/drop + paste handling

Each extension only depends on `@typix-editor/core` (and Lexical transitively). No framework bindings live here.

**Package location:** `packages/extensions/`

---

### 4. Design System (`@typix/design-system`)

A framework-agnostic styling layer that provides visual consistency across all editor surfaces.

**Responsibilities:**
- **Theme presets** — predefined Tailwind CSS class configurations
- **Default node styles** — baseline typography and spacing for every Lexical node type
- **Dark / light mode** — CSS custom property switching
- **Typography scales** — heading sizes, body text, code fonts
- **Component tokens** — CSS variables for toolbar, menus, tooltips, etc.

**Package location:** `packages/design-system/`

---

### 5. All Features

The composed layer where `Typix Extensions` and the `Design System` are combined into a single cohesive feature set. Framework adapters consume this layer.

---

### 6. Framework Adapters

Thin integration layers that bind the headless core to a specific UI framework's reactivity model.

| Adapter | Package | Status |
|---|---|---|
| React | `@typix-editor/react` | Active |
| Vue | `@typix-editor/vue` | Planned |
| Svelte | `@typix-editor/svelte` | Planned |

Each adapter:
- Provides framework-native components (e.g., `<TypixEditor />` for React)
- Wraps the event emitter with the framework's state primitives (signals, refs, reactive)
- Exposes hooks / composables / stores for reading editor state reactively
- Does **not** contain editor logic — all logic lives in `@typix-editor/core`

---

## Dependency Rules

```
lexical                    (external, no typix deps)
  └── @typix-editor/core   (depends on: lexical)
        ├── extensions/*   (depends on: core + lexical)
        ├── design-system  (depends on: nothing at runtime — CSS only)
        └── adapters/*     (depends on: core + extensions + design-system)
```

- Extensions must **never** depend on an adapter
- Adapters must **never** contain editor state logic
- The design system must **never** depend on a framework

---

## Monorepo Structure

```
typix/
├── packages/
│   ├── core/                        # @typix-editor/core
│   ├── react/                       # @typix-editor/react
│   ├── design-system/
│   │   └── ui/                      # @typix-editor/ui (React UI primitives)
│   ├── theme/                       # @typix-editor/theme (SCSS → CSS tokens)
│   └── extensions/
│       ├── rich-text/
│       ├── link/
│       ├── image/
│       ├── table/
│       ├── markdown-shortcuts/
│       ├── code-highlight-shiki/
│       ├── code-highlight-prism/
│       ├── drag-drop-paste/
│       ├── auto-link/
│       ├── auto-complete/
│       ├── collapsible/
│       ├── keywords/
│       └── max-length/
├── apps/
│   ├── playground/                  # Local dev playground (Next.js)
│   ├── typix/                       # Docs site (@typix-editor/docs)
│   └── storybook/                   # Component visual docs
└── turbo/
```
