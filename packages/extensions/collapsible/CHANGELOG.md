# @typix-editor/extension-collapsible

## 5.0.0

### Major Changes

- Migrated to the v2 static `defineExtension` shape. Adds three new nodes — `CollapsibleContainerNode`, `CollapsibleTitleNode`, and `CollapsibleContentNode` — for expandable/collapsible blocks (FAQ entries, spoilers, foldable sections).
- Open/close state persists in serialized JSON, so collapsed sections round-trip through `editor.getJSON()` / `setContent()` without losing state.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 2.0.0

### Major Changes

- Breaking changes: Renamed extension_nodes to extensionNodes, classnames to classNames, moved Lexical re-exports to @typix-editor/react/lexical subpath, removed default exports, replaced useEditor with useEditorState hook, added node registration validation, fixed dependency placement.
