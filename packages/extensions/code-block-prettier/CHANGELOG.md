# @typix-editor/extension-code-block-prettier

## 5.0.0

### Major Changes

- **Initial release.** Adds a `formatCodeBlock` command that pipes the active code block's content through Prettier for the matching language (TS/JS/TSX/JSX, CSS, JSON, Markdown, HTML).
- Lazy-loads Prettier plugins per language to keep the initial bundle small — only the languages a user actually formats get loaded.
- Pairs with `extension-code-block` (required) and the `CodeBlockUI` overlay's format button.
