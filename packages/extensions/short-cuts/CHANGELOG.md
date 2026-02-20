# @typix-editor/extension-short-cuts

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

### Patch Changes

- Updated dependencies [[`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050)]:
  - @typix-editor/react@4.0.0

## 2.0.0

### Major Changes

- Breaking changes: Renamed extension_nodes to extensionNodes, classnames to classNames, moved Lexical re-exports to @typix-editor/react/lexical subpath, removed default exports, replaced useEditor with useEditorState hook, added node registration validation, fixed dependency placement.

### Patch Changes

- Updated dependencies []:
  - @typix-editor/react@2.0.0

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
