# `typix add`

Install one or more Typix extensions and print the import snippet you need to paste into your editor.

```
typix add [extensions...] [options]
```

## Synopsis

`typix add` is a thin wrapper around `<pm> add @typix-editor/extension-<name>` that:

1. Detects your project's package manager
2. Resolves friendly names (`bold`, `image`) to npm package names
3. Installs them in one call
4. Prints the exact import + extension-array snippet to copy into your editor

It does **not** edit your editor file directly. We chose this to keep the CLI predictable — your `<Editor />` is yours.

---

## Arguments

| Argument | Description |
|---|---|
| `extensions...` | One or more extension names. If omitted, an interactive multi-select picker opens. |

Extension names are the short ones from the registry — see [`typix list`](./list.md) for what's available. Examples: `bold`, `italic`, `heading`, `image`, `table`, `mention`, `slash-command`, `floating-link`, `code-block`, `code-highlight-shiki`.

---

## Options

| Flag | Description |
|---|---|
| `-a, --all` | Install every extension in the registry |
| `--package <pm>` | Force a specific package manager (`npm` \| `pnpm` \| `yarn` \| `bun`). Otherwise auto-detected from lockfile. |
| `--no-cache` | Bypass cache when reading the registry |
| `-d, --debug` | Dry-run — print the install command and snippet without running anything |

---

## Examples

### Interactive

```bash
typix add
```

Output:

```
┌  Typix CLI v2.0.0
│
◇  Select extensions to add (space to toggle)
│  [ ] starter-kit (bold/italic/heading/list/...)
│  [x] image (block image with resize, caption, alignment)
│  [x] table (table with rows, columns, cell merging)
│  [ ] mention (@-mention popover)
│  [ ] slash-command (/ command palette)
│  ... (full list)
│
◇  Detected package manager: pnpm
│
◇  Installing 2 extensions...
│  pnpm add @typix-editor/extension-image @typix-editor/extension-table
│
◇  Done.
│
Add these to your editor:

  import { ImageExtension, configExtension } from "@typix-editor/extension-image"
  import { TableExtension } from "@typix-editor/extension-table"
  import { imageRenderer } from "@typix-editor/ui"  // or your own renderer

  const extensions = [
    // ...existing
    configExtension(ImageExtension, { component: imageRenderer }),
    TableExtension,
  ]

The extensions augment TypixCommands<R> automatically — your chain
calls (editor.chain().insertImage(...), editor.chain().insertTable())
will be fully typed.
```

### Explicit

```bash
typix add bold italic underline
```

No prompts. Installs the three packages and prints the combined snippet.

### Install everything

```bash
typix add --all
```

Useful when you want to evaluate Typix's full surface in a sandbox.

### Dry-run

```bash
typix add image --debug
```

Prints what would be installed and the snippet, without running the install.

---

## How extension names resolve

The CLI maintains a registry mapping friendly names to npm packages and snippet metadata. Examples:

| You type | Resolved package | Snippet form |
|---|---|---|
| `bold`, `italic`, `underline`, `strike`, `subscript`, `superscript`, `highlight`, `heading`, `blockquote`, `list`, `code`, `alignment`, `link`, `history`, `font-size`, `font-family`, `text-color`, `direction` | `@typix-editor/extension-starter-kit` | Single-import per mark (`import { BoldExtension } from ...`) |
| `starter-kit` | `@typix-editor/extension-starter-kit` | Bundle factory (`StarterKit()`) |
| `image` | `@typix-editor/extension-image` | With config: `configExtension(ImageExtension, { component })` |
| `table` | `@typix-editor/extension-table` | Bare |
| `mention` | `@typix-editor/extension-mention` | With config: `configExtension(MentionExtension, { trigger: "@" })` |
| `slash-command` | `@typix-editor/extension-slash-command` | Bare + needs UI |
| `floating-link` | `@typix-editor/extension-floating-link` | Bare + needs UI |
| `code-block` | `@typix-editor/extension-code-block` | Bare |
| `code-highlight-shiki` | `@typix-editor/extension-code-highlight-shiki` | Bare |
| `code-highlight-prism` | `@typix-editor/extension-code-highlight-prism` | Bare |
| `code-block-prettier` | `@typix-editor/extension-code-block-prettier` | With config |
| `markdown-shortcuts` | `@typix-editor/extension-markdown-shortcuts` | Bare |
| `drag-drop-paste` | `@typix-editor/extension-drag-drop-paste` | Bare |
| `collapsible`, `keywords`, `max-length`, `character-limit`, `tab-focus`, `auto-link`, `auto-complete`, `context-menu`, `draggable-block`, `short-cuts`, `speech-to-text`, `tailwind` | `@typix-editor/extension-<name>` | Bare |

If you pass the full package name (`@typix-editor/extension-image`), it's accepted too.

---

## Package manager detection

The CLI looks for, in order:

1. `bun.lockb` → bun
2. `pnpm-lock.yaml` → pnpm
3. `yarn.lock` → yarn
4. `package-lock.json` → npm

Override with `--package <pm>`.

---

## Errors

| Error | Cause | Fix |
|---|---|---|
| `Unknown extension: 'foo'` | Name not in registry | Run `typix list --available` to see all names |
| `No package.json found in current directory` | You're not in a project root | `cd` into your project |
| `Package manager 'pnpm' not installed` | Auto-detected pnpm but it's missing | Install pnpm or pass `--package npm` |

---

## See also

- [`typix remove`](./remove.md) — uninstall extensions
- [`typix upgrade`](./upgrade.md) — bump to latest
- [`typix list`](./list.md) — see what's installed and what's available
- [`typix ui add`](./ui-add.md) — vendor UI components for extensions like slash-command, mention, etc.
