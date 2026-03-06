# Design System — `@typix-editor/ui` + `@typix-editor/theme`

## Overview

The Typix design system is a **framework-agnostic styling and component layer** that provides visual consistency across all editor surfaces. It is split into two packages:

| Package | Location | Purpose |
|---|---|---|
| `@typix-editor/theme` | `packages/theme/` | CSS tokens, SCSS design foundation, node typography |
| `@typix-editor/ui` | `packages/design-system/ui/` | React UI primitives (Tailwind + Radix-backed) |

Neither package contains any editor logic. They are purely visual.

---

## `@typix-editor/theme`

### What it provides

- **CSS custom properties** — the single source of truth for all visual tokens
- **Default node styles** — baseline typography and spacing for every Lexical node type (paragraphs, headings, lists, code blocks, quotes, tables)
- **Dark / light mode** — automatic switching via CSS custom properties
- **Typography scales** — heading sizes, body text, monospace fonts
- **SCSS foundation** — variables, mixins, and a layer architecture

### Architecture

Built with Dart Sass, compiled to plain CSS. Uses `@layer` for predictable cascade ordering:

```
foundation  →  tokens  →  base  →  nodes  →  components
```

| Layer | Contents |
|---|---|
| `foundation` | Sass variables and mixins |
| `tokens` | `:root` CSS custom properties |
| `base` | HTML element resets |
| `nodes` | Lexical node type styles |
| `components` | Toolbar, menu, tooltip base styles |

### Dark mode

```scss
@include dark-mode {
  // Applied under: .dark &, [data-theme="dark"] &
}
```

### Usage

```ts
// In your app entry
import "@typix-editor/theme"
// or
import "@typix-editor/theme/dist/index.css"
```

---

## `@typix-editor/ui`

### What it provides

A set of **18 React UI primitives** built on Radix UI + Tailwind CSS v4, styled with Typix's design token system. Used by the playground, docs site, and Storybook — and available for consumers building editor chrome.

### Tech stack

| Technology | Role |
|---|---|
| Radix UI | Accessible primitive behavior (focus, ARIA, keyboard nav) |
| Tailwind CSS v4 | Utility-first styling via `@theme inline` token bridge |
| CVA (class-variance-authority) | Variant-based component APIs |
| clsx + tailwind-merge | Conditional class composition (`cn()` utility) |
| cmdk | Command palette primitive |
| react-textarea-autosize | Auto-growing textarea |
| react-day-picker v9 | Calendar component |

### Component Catalog

| Component | Backed by | Notes |
|---|---|---|
| `Button` | Radix Slot + CVA | `variant`, `size` props |
| `Badge` | CVA | `variant` prop |
| `Input` | Custom | `inputSize` prop (sm/md/lg) |
| `Textarea` | react-textarea-autosize | Auto-grows |
| `Label` | Custom | Form label |
| `Separator` | Radix Separator | Horizontal/vertical |
| `Tooltip` | Radix Tooltip | Hover tooltip |
| `Popover` | Radix Popover | Click-triggered overlay |
| `DropdownMenu` | Radix DropdownMenu | Trigger + items |
| `ContextMenu` | Radix ContextMenu | Right-click menu |
| `Select` | Radix Select | Single selection |
| `Switch` | Radix Switch | Toggle |
| `Checkbox` | Radix Checkbox | Check/uncheck |
| `Tabs` | Radix Tabs | Tabbed panels |
| `Avatar` | Custom | Image with fallback initials |
| `Card` | Custom | Surface container |
| `Command` | cmdk | Command palette / combobox |
| `Calendar` | react-day-picker v9 | Date picker |
| `Kbd` | Custom | Keyboard shortcut display |

### Usage

```ts
import { Button, Tooltip, DropdownMenu } from "@typix-editor/ui"
import "@typix-editor/ui/styles"  // CSS bundle
```

### `cn()` utility

```ts
import { cn } from "@typix-editor/ui/lib/utils"

cn("base-class", condition && "conditional-class", "another-class")
// → clsx + tailwind-merge
```

---

## Design Tokens

All tokens are defined as CSS custom properties in `packages/design-system/ui/src/styles/globals.css` and bridged to Tailwind's `@theme inline` in `tailwind.css`.

### Token Naming

```
--typix-ui-{category}-{variant}
```

### Categories

| Prefix | Purpose | Example |
|---|---|---|
| `--typix-ui-stone-*` | Stone color palette (50–950) | `--typix-ui-stone-500` |
| `--typix-ui-color-*` | Semantic surface/fg/border | `--typix-ui-color-surface` |
| `--typix-ui-c-*` | Component semantic colors | `--typix-ui-c-primary` |
| `--typix-ui-text-*` | Font size scale | `--typix-ui-text-sm` |
| `--typix-ui-space-*` | Spacing scale | `--typix-ui-space-4` |
| `--typix-ui-radius-*` | Border radius | `--typix-ui-radius-md` |
| `--typix-ui-shadow-*` | Box shadow levels | `--typix-ui-shadow-sm` |
| `--typix-ui-transition-*` | Easing + duration | `--typix-ui-transition-fast` |

### Semantic Color Palette

Component colors follow the pattern `--typix-ui-c-{color}-{variant}`:

| Color | `{color}` | Base use |
|---|---|---|
| Default (zinc) | `default` | Neutral surfaces, borders |
| Primary (blue) | `primary` | Actions, focus rings |
| Secondary (purple) | `secondary` | Tags, highlights |
| Success (green) | `success` | Confirmations |
| Warning (amber) | `warning` | Caution states |
| Danger (pink) | `danger` | Destructive actions |

Variants: `-rgb` (bare RGB values for `rgba()`), base fill, `-h` (hover), `-fg` (text on solid), `-text` (text on tinted bg).

### shadcn OKLCH Tokens

Standard shadcn tokens are also present (`:root` + `.dark`):

```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--radius
```

These are bridged to Tailwind via `@theme inline` so you can use `bg-background`, `text-foreground`, etc. directly in Tailwind classes.

---

## Build

```bash
# Build JS + type declarations
pnpm turbo build --filter='./packages/design-system/ui'

# Build CSS separately
@tailwindcss/cli -i src/styles/tailwind.css -o dist/index.css
```

CSS is exported as `@typix-editor/ui/styles` via package.json exports.

---

## Dependency Rules

- `@typix-editor/theme` must **never** depend on React or any JS framework
- `@typix-editor/ui` may depend on React, Radix UI, Tailwind
- `@typix-editor/ui` and `@typix-editor/theme` must **never** depend on `@typix-editor/core` or any extension
- These packages are purely visual — no editor logic
