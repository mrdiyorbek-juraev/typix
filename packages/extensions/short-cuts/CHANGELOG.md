# @typix-editor/extension-short-cuts

## 4.0.0

### Major Changes

- [#35](https://github.com/mrdiyorbek-juraev/typix/pull/35) [`3111db7`](https://github.com/mrdiyorbek-juraev/typix/commit/3111db78e30d1760192aa44a39163a1718e62b72) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - feat(short-cuts): add keyboard shortcuts extension

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

### Patch Changes

- Updated dependencies [[`3111db7`](https://github.com/mrdiyorbek-juraev/typix/commit/3111db78e30d1760192aa44a39163a1718e62b72)]:
  - @typix-editor/react@4.0.0
