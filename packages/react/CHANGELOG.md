# @typix-editor/react

## 5.0.0

### Major Changes

- **New hook API: `useTypixEditor`.** Creates the editor instance with extensions, theme, namespace, and initial content; returns a stable `TypixEditor`. Pairs with `TypixEditorContext.Provider` for sharing across the React tree. The legacy `useEditor` is removed.
- **`useTypixEditorState()`** — subscribes to live editor state with React-safe rerenders for selection, format flags, active marks, and command capabilities. Replaces ad-hoc selection listeners + `useActiveFormats`.
- **`useCurrentTypixEditor()`** — typed accessor for the editor instance from any descendant, returning the same `TypixEditor` that `useTypixEditor` produces.
- **`<EditorContent />`** — the single render component for the editable surface. Receives `editor`, `placeholder`, `className`, and other props; internally wires Lexical's `RichTextPlugin`, `ContentEditable`, history, shortcuts, and default plugins.
- **`<TypixEditorProvider />`** — sugar for `useTypixEditor` + `TypixEditorContext.Provider` when you don't need the raw hook return value.
- **`defaultTheme`** export that maps Lexical's node names to the `.typix-*` class vocabulary the design-system CSS targets.
- **Lexical re-exports moved to `@typix-editor/react/lexical`** subpath (already in 4.0.0; reaffirmed).
- **Shortcuts plugin + history context are split out** of `<EditorContent />` internals into `editor-content/shortcuts-plugin.tsx` and `editor-content/history-context.tsx`, making them overridable.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 2.0.0

### Major Changes

- Breaking changes: Renamed extension_nodes to extensionNodes, classnames to classNames, moved Lexical re-exports to @typix-editor/react/lexical subpath, removed default exports, replaced useEditor with useEditorState hook, added node registration validation, fixed dependency placement.

## 4.0.0

### Minor Changes

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

## 3.0.0

### Patch Changes

- [#29](https://github.com/mrdiyorbek-juraev/typix/pull/29) [`fe1abfc`](https://github.com/mrdiyorbek-juraev/typix/commit/fe1abfc70b1b6f626e40c47b2cdafcc2f62c6a2f) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Add flexible mention extension with typeahead support

  **@typix-editor/extension-mention (new package)**

  - MentionNode with configurable display options (trigger, className, style)
  - MentionExtension with customizable search, rendering, and trigger configuration
  - Support for async/sync search with built-in debouncing
  - Headless UI support via `renderMenu` and `renderMenuItem` props
  - Validation to ensure MentionNode is registered in editor config

  **@typix-editor/react**

  - Add `isEmpty` state to `useEditor` hook for detecting empty editor content

## 2.0.0

### Major Changes

- Initial stable release of Typix Editor Framework

### Patch Changes

- Updated dependencies []:
  - @typix-editor/extension-rich-text@2.0.0

## 1.0.0

### Major Changes

- 🎉 Launch v1.0.0 - Typix Editor Framework

### Patch Changes

- Updated dependencies []:
  - @typix-editor/extension-rich-text@1.0.0

## 1.0.0

### Major Changes

- [`7f39884`](https://github.com/mrdiyorbek-juraev/typix/commit/7f398846df6e1370171b377198e84c31c5cf9cfb) Thanks [@diyorbekjuraev-nordra](https://github.com/diyorbekjuraev-nordra)! - Initial public release of Typix React bindings and rich-text extension

### Patch Changes

- Updated dependencies [[`7f39884`](https://github.com/mrdiyorbek-juraev/typix/commit/7f398846df6e1370171b377198e84c31c5cf9cfb)]:
  - @typix/extension-rich-text@1.0.0
