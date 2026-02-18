# @typix-editor/extension-draggable-block

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

### Patch Changes

- Updated dependencies [[`3111db7`](https://github.com/mrdiyorbek-juraev/typix/commit/3111db78e30d1760192aa44a39163a1718e62b72)]:
  - @typix-editor/react@4.0.0

## 3.1.0

### Minor Changes

- [#32](https://github.com/mrdiyorbek-juraev/typix/pull/32) [`1208696`](https://github.com/mrdiyorbek-juraev/typix/commit/12086968c4cddd14aeedf88b422fb70bb425ac59) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Add draggable block extension for block reordering

  **@typix-editor/extension-draggable-block (new package)**

  - DraggableBlockExtension component using Lexical's experimental DraggableBlockPlugin
  - Customizable classNames via `classNames` prop object (menu, targetLine, icon)
  - Built-in default grip icon with optional custom icon support via `dragHandleIcon` prop
  - Automatic integration with Typix's `useRootContext` for anchor element
  - Includes default CSS styles with CSS variable customization support
