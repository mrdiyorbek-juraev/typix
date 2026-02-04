# @typix/react

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
