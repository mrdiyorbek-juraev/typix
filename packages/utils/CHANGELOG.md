# @typix-editor/utils

## 5.0.1

### Patch Changes

- Patch release 5.0.1 — minor fixes across cli, core, react, utils, and extensions.

## 5.0.0

### Major Changes

- **Initial public release.** Shared utilities consumed by `@typix-editor/core` and `@typix-editor/react` — small, dependency-light helpers extracted to keep the core packages lean.
- **`cn()`** — class-merge helper combining `clsx` + `tailwind-merge`. The standard utility used across every Typix component.
- **`@typix-editor/utils/lexical`** — Lexical-specific helpers (selection inspection, node walking, mark utilities) that don't belong in core but are needed by extensions + adapters.
