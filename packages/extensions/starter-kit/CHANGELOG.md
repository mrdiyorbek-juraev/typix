# @typix-editor/extension-starter-kit

## 5.0.0

### Major Changes

- **Initial release.** The "batteries-included" bundle — one import that registers all the common formatting extensions: bold, italic, underline, strike, code, subscript, superscript, link, heading, blockquote, list, alignment, direction, font family, font size, text color, highlight, auto-link.
- Each sub-extension is exposed under `StarterKit({ <name>: false })` so users can opt-out of pieces they don't want without losing the rest.
- Designed to be the **first** extension users register, then layer specialized extensions (mention, slash-command, table, image) on top.
