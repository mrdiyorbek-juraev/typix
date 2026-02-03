# @typix-editor/extension-draggable-block

## 3.1.0

### Minor Changes

- [#32](https://github.com/mrdiyorbek-juraev/typix/pull/32) [`1208696`](https://github.com/mrdiyorbek-juraev/typix/commit/12086968c4cddd14aeedf88b422fb70bb425ac59) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Add draggable block extension for block reordering

  **@typix-editor/extension-draggable-block (new package)**

  - DraggableBlockExtension component using Lexical's experimental DraggableBlockPlugin
  - Customizable classNames via `classNames` prop object (menu, targetLine, icon)
  - Built-in default grip icon with optional custom icon support via `dragHandleIcon` prop
  - Automatic integration with Typix's `useRootContext` for anchor element
  - Includes default CSS styles with CSS variable customization support
