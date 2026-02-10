# @typix-editor/extension-mention

## 2.0.0

### Major Changes

- Breaking changes: Renamed extension_nodes to extensionNodes, classnames to classNames, moved Lexical re-exports to @typix-editor/react/lexical subpath, removed default exports, replaced useEditor with useEditorState hook, added node registration validation, fixed dependency placement.

### Patch Changes

- Updated dependencies []:
  - @typix-editor/react@2.0.0

## 4.0.0

### Patch Changes

- Updated dependencies [[`3111db7`](https://github.com/mrdiyorbek-juraev/typix/commit/3111db78e30d1760192aa44a39163a1718e62b72)]:
  - @typix-editor/react@4.0.0

## 3.0.0

### Minor Changes

- [#29](https://github.com/mrdiyorbek-juraev/typix/pull/29) [`fe1abfc`](https://github.com/mrdiyorbek-juraev/typix/commit/fe1abfc70b1b6f626e40c47b2cdafcc2f62c6a2f) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Add flexible mention extension with typeahead support

  **@typix-editor/extension-mention (new package)**

  - MentionNode with configurable display options (trigger, className, style)
  - MentionExtension with customizable search, rendering, and trigger configuration
  - Support for async/sync search with built-in debouncing
  - Headless UI support via `renderMenu` and `renderMenuItem` props
  - Validation to ensure MentionNode is registered in editor config

  **@typix-editor/react**

  - Add `isEmpty` state to `useEditor` hook for detecting empty editor content

### Patch Changes

- Updated dependencies [[`fe1abfc`](https://github.com/mrdiyorbek-juraev/typix/commit/fe1abfc70b1b6f626e40c47b2cdafcc2f62c6a2f)]:
  - @typix-editor/react@3.0.0
