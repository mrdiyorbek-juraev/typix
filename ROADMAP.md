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
| `extension-table` | Table with rows, columns, cell merging, resize handles | advanced | open |
| `extension-image` | Block image with resize, alignment, caption, alt text | intermediate | open |
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
| `extension-undo-redo` | Visual undo/redo toolbar buttons with history UI | beginner | open |

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
| Extension starter template | `pnpm create typix-extension` scaffolding CLI | intermediate | open |
| Storybook stories | Visual stories for each extension | beginner | open |
| Playground examples | Add demo for each extension in playground app | beginner | open |
| Performance benchmarks | Benchmark large documents, rapid typing | intermediate | open |
| Error boundary patterns | Standard error boundaries for extensions | beginner | open |

---

## 5. Core Improvements

| Task | Description | Difficulty | Status |
|------|-------------|------------|--------|
| SSR support | Ensure all components work with Next.js App Router SSR | intermediate | open |
| Collaboration (Yjs) | Real-time collaborative editing extension | advanced | open |
| Content serialization | JSON, HTML, and Markdown import/export utilities | intermediate | open |
| Theme system | Customizable theming beyond the default theme | intermediate | open |
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
