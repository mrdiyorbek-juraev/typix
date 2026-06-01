# @typix-editor/extension-floating-link

## 5.0.0

### Major Changes

- Migrated to the v2 static `defineExtension` shape. Tracks the active link node + edit state so the `FloatingLinkUI` component can render a positioned popover (vendor via `typix ui add floating-link`).
- `URL` validation, edit/cancel/delete actions, and the input ref are all exposed as render props on the UI side.

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
