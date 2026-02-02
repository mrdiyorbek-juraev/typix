# @typix-editor/extension-mention

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
