# @typix-editor/extension-image

## 5.0.1

### Patch Changes

- Patch release 5.0.1 — minor fixes across cli, core, react, utils, and extensions.

- Updated dependencies []:
  - @typix-editor/extension-drag-drop-paste@5.0.1

## 5.0.0

### Major Changes

- **Initial release.** Provides the `ImageNode` plus the `INSERT_IMAGE_COMMAND`, with support for alt text, caption, width/height, and alignment (`left | center | right | full-width`).
- Pluggable renderer — pass `renderer: imageRenderer` from `@typix-editor/ui` for the default toolbar/caption/resize composition, or swap in your own component for full control.
- Depends on `extension-drag-drop-paste` so dropped files auto-insert as image nodes.
