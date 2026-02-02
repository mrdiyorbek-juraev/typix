---
"@typix-editor/extension-draggable-block": minor
---

Add draggable block extension for block reordering

**@typix-editor/extension-draggable-block (new package)**
- DraggableBlockExtension component using Lexical's experimental DraggableBlockPlugin
- Customizable classNames via `classNames` prop object (menu, targetLine, icon)
- Built-in default grip icon with optional custom icon support via `dragHandleIcon` prop
- Automatic integration with Typix's `useRootContext` for anchor element
- Includes default CSS styles with CSS variable customization support
