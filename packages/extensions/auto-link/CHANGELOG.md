# @typix-editor/extension-auto-link

## 5.0.0

### Major Changes

- Migrated to the v2 static `defineExtension` shape — configure `urlRegExp`, `linkClass`, and `target` once and pass directly to `useTypixEditor`.
- Detects URLs as the user types and wraps them in a Lexical `LinkNode`, with optional click-to-open behavior.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 2.0.0

### Major Changes

- Breaking changes: Renamed extension_nodes to extensionNodes, classnames to classNames, moved Lexical re-exports to @typix-editor/react/lexical subpath, removed default exports, replaced useEditor with useEditorState hook, added node registration validation, fixed dependency placement.

## 1.0.0

### Major Changes

- 🎉 Launch v1.0.0 - Typix Editor Framework
