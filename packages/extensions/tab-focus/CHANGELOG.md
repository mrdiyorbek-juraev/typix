# @typix-editor/extension-tab-focus

## 5.0.0

### Major Changes

- Migrated to the v2 static `defineExtension` shape. Restores normal Tab focus behavior — Tab moves focus out of the editor instead of inserting a tab character. Shift+Tab still moves focus backwards.
- Useful for accessibility and form-embedded editors where trapping focus is undesirable.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 2.0.0

### Major Changes

- Breaking changes: Renamed extension_nodes to extensionNodes, classnames to classNames, moved Lexical re-exports to @typix-editor/react/lexical subpath, removed default exports, replaced useEditor with useEditorState hook, added node registration validation, fixed dependency placement.
