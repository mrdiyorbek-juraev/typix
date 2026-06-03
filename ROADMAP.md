# Typix Roadmap

This roadmap outlines planned features, improvements, and areas where contributors can help. Items are organized by priority and difficulty.

## Legend

- **Difficulty:** `beginner` | `intermediate` | `advanced`
- **Status:** `open` | `in progress` | `done`

---

## 1. New Extensions

### Core (High Priority)

| Extension | Description | Difficulty | Status |
|-----------|-------------|------------|--------|
| `extension-table` | Table with rows, columns, cell merging, resize handles | advanced | **done** |
| `extension-image` | Block image with resize, alignment, caption, alt text | intermediate | **done** |
| `extension-horizontal-rule` | Horizontal divider block (`---`) | beginner | open |
| `extension-page-break` | Page break for print/export layouts | beginner | open |
| `extension-emoji` | Emoji picker with search and skin tone support | intermediate | open |

### Advanced (Medium Priority)

| Extension | Description | Difficulty | Status |
|-----------|-------------|------------|--------|
| `extension-equation` | LaTeX/KaTeX math equation blocks and inline math | intermediate | open |
| `extension-find-replace` | Find & replace across editor content | intermediate | open |
| `extension-layout` | Multi-column layout blocks (2-col, 3-col) | advanced | open |
| `extension-inline-image` | Inline images within text flow | intermediate | open |
| Undo/Redo toolbar UI | Shipped as `UndoRedoButton` in `@typix-editor/ui` instead of a standalone extension. Use `typix ui add undo-redo-button`. | — | **done** |

### Embeds (Lower Priority)

| Extension | Description | Difficulty | Status |
|-----------|-------------|------------|--------|
| `extension-video` | YouTube, Vimeo, and generic video embeds | intermediate | open |
| `extension-tweet` | Twitter/X tweet embeds | intermediate | open |
| `extension-figma` | Figma design embeds | beginner | open |
| `extension-excalidraw` | Excalidraw whiteboard/diagram embedding | advanced | open |
| `extension-poll` | Interactive poll/survey blocks | intermediate | open |

---

## 2. Testing

Current test coverage: **9/16 extensions tested** (56%)

| Task | Scope | Difficulty | Status |
|------|-------|------------|--------|
| Add tests for `extension-link` | Unit tests for link node and validation | beginner | open |
| Add tests for `extension-tab-focus` | Tab navigation behavior | beginner | open |
| Add tests for `extension-context-menu` | Menu rendering, item clicks | intermediate | open |
| Add tests for `extension-drag-drop-paste` | File drop, image paste events | intermediate | open |
| Add tests for `extension-draggable-block` | Drag handle, block reordering | intermediate | open |
| Add E2E test setup | Playwright for browser-level editor testing | advanced | open |

---

## 3. Accessibility

Currently no explicit ARIA attributes in the codebase. This is a critical gap.

| Task | Scope | Difficulty | Status |
|------|-------|------------|--------|
| Add ARIA labels to EditorBubbleMenu | `role`, `aria-label`, keyboard nav | beginner | open |
| Add ARIA labels to EditorCommand | `role="listbox"`, `aria-activedescendant` | intermediate | open |
| Add ARIA live regions | Announce format changes, word count, errors | intermediate | open |
| Keyboard navigation audit | Ensure all interactive elements are focusable | intermediate | open |
| Screen reader testing guide | Document testing with NVDA/VoiceOver | beginner | open |

---

## 4. Developer Experience

| Task | Description | Difficulty | Status |
|------|-------------|------------|--------|
| Storybook stories | Visual stories for each extension | beginner | open |
| Playground examples | Add demo for each extension in playground app | beginner | open |
| Performance benchmarks | Benchmark large documents, rapid typing | intermediate | open |
| Error boundary patterns | Standard error boundaries for extensions | beginner | open |

---

## 5. CLI (`@typix-editor/cli`)

Shipped:

| Command | Description | Status |
|---------|-------------|--------|
| `typix init` | Interactive `typix.json` setup | **done** |
| `typix add [extensions...]` | Install editor extensions as npm packages | **done** |
| `typix remove [extensions...]` | Uninstall extensions | **done** |
| `typix upgrade [extensions...]` | Bump installed extensions | **done** |
| `typix list` | Catalog of available extension packages | **done** |
| `typix ui list` | Catalog of `@typix-editor/ui` components, mark which are vendored | **done** |
| `typix ui add [components...]` | Vendor source into `./components/typix/` (shadcn-style) | **done** |
| `typix ui remove [components...]` | Remove vendored components, orphan-aware (preserves shared deps) | **done** |

Planned:

| Command | Description | Difficulty | Status |
|---------|-------------|------------|--------|
| `typix doctor` | Diagnose common project issues (deps, CSS imports, source globs) | intermediate | open |
| `typix env` | Print env / installed-package report for issue triage | beginner | open |
| `typix generate node <name>` | Scaffold a custom Lexical node | intermediate | open |
| `typix generate extension <name>` | Scaffold a new extension package (monorepo) | intermediate | open |
| `typix agents-md` | Auto-generate `AGENTS.md` for AI coding assistants | intermediate | open |

---

## 6. Framework Adapters

| Adapter | Description | Difficulty | Status |
|---------|-------------|------------|--------|
| `@typix-editor/react` | React 18/19 adapter — hooks, components, context | — | **done** |
| `@typix-editor/svelte` | Svelte 5 adapter with runes (skill exists at `.claude/skills/svelte-adapter/`, package not started) | advanced | open |
| `@typix-editor/vue` | Vue 3 adapter with composables (skill exists at `.claude/skills/vue-adapter/`, package not started) | advanced | open |
| `@typix-editor/solid` | Solid.js adapter | advanced | open |

---

## 7. Core Improvements

| Task | Description | Difficulty | Status |
|------|-------------|------------|--------|
| SSR support | Ensure all components work with Next.js App Router SSR (`immediatelyRender: false` pattern) | intermediate | **done** |
| Design system consolidation | Single `@typix-editor/ui` package owning tokens + primitives + main components + editor CSS (replaced standalone `@typix-editor/theme` package) | intermediate | **done** |
| Collaboration (Yjs) | Real-time collaborative editing extension | advanced | open |
| Content serialization | JSON, HTML, and Markdown import/export utilities | intermediate | open |
| Theme customization API | Override CSS tokens via JS at runtime (currently CSS-only) | intermediate | open |
| Plugin lifecycle hooks | `onInit`, `onDestroy`, `onFocus`, `onBlur` for extensions | advanced | open |

---

## Contributing

1. Pick an item from this roadmap
2. Open an issue to discuss your approach
3. Fork the repo and create a branch: `feat/extension-{name}` or `fix/{description}`
4. Follow existing extension patterns in `packages/extensions/`
5. Include tests and documentation
6. Submit a PR using the [pull request template](.github/pull_request_template.md)

### Extension Development Guide

Each extension should follow this structure:

```
packages/extensions/{name}/
├── src/
│   ├── extension/index.tsx    # Main extension component
│   ├── node/index.ts          # Custom Lexical node (if needed)
│   └── types/index.ts         # TypeScript types
├── __tests__/                 # Vitest tests
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

**Requirements for new extensions:**
- Named export only (no default exports)
- `displayName = "Typix.ExtensionName"` on the component
- Node validation with `editor.hasNodes()` if registering custom nodes
- `@typix-editor/react` as a `peerDependency`
- Tests with Vitest
- Documentation MDX page in `apps/typix/content/docs/extensions/`
