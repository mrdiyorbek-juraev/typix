---
"@typix-editor/extension-short-cuts": major
"@typix-editor/react": minor
---

feat(short-cuts): add keyboard shortcuts extension

- Add new keyboard shortcuts extension with support for:
  - Block formatting (paragraph, headings, lists, code, quote)
  - Text formatting (strikethrough, subscript, superscript, case transforms)
  - Indentation (indent/outdent)
  - Alignment (left, center, right, justify)
  - Font size controls
  - Link insertion
  - Clear formatting

feat(react): add useActiveFormats hook and editor context improvements

- Add useActiveFormats hook for tracking active text formats
- Add editor context for better state management
- Enhance bubble-menu component
- Refactor home view with modular components
