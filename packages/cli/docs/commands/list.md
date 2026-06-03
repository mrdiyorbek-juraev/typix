# `typix list`

List Typix packages — installed in the current project, available from the registry, or both.

```
typix list [options]
```

## Synopsis

A quick inventory tool. By default shows what's installed in `./package.json`. Pass `--available` to see the full catalog of installable extensions, or `--all` for both side-by-side.

---

## Options

| Flag | Description |
|---|---|
| `--installed` | Show only packages currently in `package.json` (default) |
| `--available` | Show only packages available to install via [`typix add`](./add.md) |
| `--all` | Show both, side-by-side |
| `--json` | Output as JSON (for scripts) |
| `--no-cache` | Bypass registry cache |

---

## Examples

### Default — installed packages

```bash
typix list
```

```
┌  Typix CLI v2.0.0
│
◇  Typix packages installed in this project:
│
│  Core:
│    @typix-editor/core                       2.0.0
│    @typix-editor/react                      2.0.0
│    @typix-editor/ui                         2.0.0
│
│  Extensions (5):
│    @typix-editor/extension-starter-kit      2.0.0
│    @typix-editor/extension-image            2.0.0
│    @typix-editor/extension-table            2.0.0
│    @typix-editor/extension-mention          2.0.0
│    @typix-editor/extension-floating-link    2.0.0
│
│  UI:
│    @typix-editor/ui                         2.0.0
│
◇  8 packages total
```

### Show what you could install

```bash
typix list --available
```

```
┌  Typix CLI v2.0.0
│
◇  Available extensions (25):
│
│  Marks & blocks:
│    starter-kit              bold/italic/heading/list/...
│    bold                     (included in starter-kit)
│    italic                   (included in starter-kit)
│    ... etc
│
│  Nodes:
│    image                    block image with resize, caption, alignment
│    table                    table with rows, columns, cell merging
│    collapsible              expandable/collapsible blocks
│    code-block               syntax-highlighted code blocks
│
│  Behaviors:
│    mention                  @-mention popover
│    slash-command            / command palette
│    floating-link            floating link editor on click
│    drag-drop-paste          paste/drop files as images
│    markdown-shortcuts       inline markdown-to-rich-text
│    auto-link                detect URLs and turn them into links
│    auto-complete            inline autocomplete suggestions
│
│  Constraints:
│    max-length               cap total content length
│    character-limit          show character count + limit
│
│  Other:
│    keywords, tab-focus, short-cuts, context-menu, draggable-block,
│    speech-to-text, tailwind, code-highlight-shiki, code-highlight-prism,
│    code-block-prettier
│
◇  Install one: typix add <name>
```

### Compare both

```bash
typix list --all
```

Shows installed packages with a ✓ checkmark and available ones not yet installed with a +.

### JSON output (for scripts / CI)

```bash
typix list --json
```

```json
{
  "installed": {
    "@typix-editor/core": "2.0.0",
    "@typix-editor/extension-image": "2.0.0"
  },
  "available": [
    { "name": "table", "package": "@typix-editor/extension-table", "description": "..." }
  ]
}
```

---

## See also

- [`typix add`](./add.md)
- [`typix env`](./env.md) — also includes installed package versions
