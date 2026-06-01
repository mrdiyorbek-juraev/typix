# `typix remove`

Uninstall one or more Typix extensions from your project.

```
typix remove [extensions...] [options]
```

## Synopsis

Inverse of [`typix add`](./add.md). Resolves friendly names to npm packages and runs your project's package manager to remove them.

Does **not** touch your editor file — you'll see import errors after the uninstall, follow them to delete the references.

---

## Arguments

| Argument | Description |
|---|---|
| `extensions...` | Extension names or full npm package names. If omitted, an interactive multi-select picker shows currently installed ones. |

---

## Options

| Flag | Description |
|---|---|
| `-a, --all` | Remove every installed Typix extension |
| `--package <pm>` | Force a specific package manager |
| `-d, --debug` | Dry-run |

---

## Examples

### Interactive

```bash
typix remove
```

```
┌  Typix CLI v2.0.0
│
◇  Select extensions to remove (space to toggle)
│  [x] @typix-editor/extension-image
│  [ ] @typix-editor/extension-table
│  [ ] @typix-editor/extension-mention
│
◇  Removing 1 extension with pnpm...
│  pnpm remove @typix-editor/extension-image
│
◇  Done.
│
⚠  Don't forget to remove the import from your editor file.
```

### Explicit

```bash
typix remove image table
```

### Remove everything Typix-related

```bash
typix remove --all
```

Removes every `@typix-editor/*` package except `@typix-editor/core` and `@typix-editor/react` (those are kept because they're the foundation; remove with regular `pnpm remove` if you really want to uninstall Typix entirely).

---

## See also

- [`typix add`](./add.md)
- [`typix list`](./list.md)
- [`typix doctor`](./doctor.md) — surfaces stale imports after removal
