# UI Primitives — `@typix-editor/ui`

## Status: COMPLETE

All 15 primitives implemented as a publishable package at `packages/design-system/ui/`.

## Completed Steps

- [x] Scaffold `packages/design-system/ui/` (package.json, tsconfig.json, tsup.config.ts)
- [x] Shared utilities: data-attr.ts, compose-refs.ts, use-controllable-state.ts, use-floating.ts
- [x] Theme foundation: SCSS variable maps, CSS custom properties, 15 primitive stylesheets, Layer 5 wiring
- [x] Simple primitives: Separator, Spacer, Badge, Label, Input, Button
- [x] Medium primitives: Tooltip, Popover, Toolbar, TextareaAutosize, Avatar, Card
- [x] Complex primitives: Menu, DropdownMenu, Combobox
- [x] Barrel export (`src/index.ts`) + build + typecheck
- [x] Storybook stories for all 15 primitives

## Verification

- `pnpm install` — workspace links resolve
- `pnpm turbo build --filter='./packages/design-system/ui' --filter='./packages/theme'` — both build clean
- `pnpm turbo typecheck --filter='./packages/design-system/ui'` — no type errors
- All 15 stories created in `apps/storybook/src/stories/ui/`

## Architecture

- **Styling**: data-attributes + CSS custom properties (`--typix-ui-*`)
- **CSS class prefix**: `typix-ui-` (distinct from `typix-` editor internals)
- **Component pattern**: forwardRef + displayName + Slot for asChild
- **Dependencies**: `@floating-ui/react-dom` + `@radix-ui/react-slot` only
- **Theme**: SCSS Layer 5 in `@typix-editor/theme`
