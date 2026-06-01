# @typix-editor/extension-markdown-shortcuts

## 5.0.0

### Major Changes

- **Initial release.** Live-converts Markdown syntax as the user types: `# ` → H1, `## ` → H2, `> ` → blockquote, `- ` / `1. ` → lists, `` ``` `` → code block, `**bold**` / `_italic_` / `~~strike~~` / `` `code` `` → inline marks.
- Each rule is opt-in via the `transformers` array — pass a subset to disable defaults you don't want, or extend with custom transformers.
