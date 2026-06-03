# `typix ui remove`

Delete vendored UI components from your project.

```
typix ui remove [components...] [options]
```

## Synopsis

Removes the directory `./components/typix/editor-ui/<component>/` for each named component. Does **not** uninstall npm peers that were added via `typix ui add` — those may be in use elsewhere in your app.

⚠️ **This deletes files you may have edited.** Make sure your changes are committed before running.

---

## Arguments

| Argument | Description |
|---|---|
| `components...` | Component names. If omitted, an interactive multi-select shows currently vendored components. |

---

## Options

| Flag | Description |
|---|---|
| `-a, --all` | Remove every vendored component |
| `--path <dir>` | Override the source path (default: `./components/typix/editor-ui/`) |
| `--remove-peers` | Also uninstall npm peers declared by the removed components |
| `--force` | Skip the "are you sure?" confirmation |
| `-d, --debug` | Dry-run — print what would be removed |

---

## Examples

### Interactive

```bash
typix ui remove
```

```
┌  Typix CLI v2.0.0
│
◇  Select vendored components to remove (space to toggle)
│  [x] bubble-menu
│  [ ] floating-link-ui
│
⚠  This will delete the following directories:
│   ./components/typix/editor-ui/bubble-menu/
│
◇  Continue? (y/N)
│  y
│
◇  Removed 1 component.
│
ℹ  npm peers were left installed. Pass --remove-peers to uninstall them.
```

### Explicit + force

```bash
typix ui remove toolbar --force
```

No prompt, no "are you sure?".

### Remove everything

```bash
typix ui remove --all --force
```

Clears out `./components/typix/editor-ui/` entirely.

---

## What about shared primitives?

If you vendored `toolbar` and `bubble-menu` together, the CLI also pulled in the `button` primitive (used by both). When you remove `toolbar` but keep `bubble-menu`, the CLI:

- Checks whether `button` is still depended on by any remaining vendored component
- If yes, leaves it alone
- If no, asks: "`button` is no longer used. Remove it too? (y/N)"

---

## See also

- [`typix ui add`](./ui-add.md)
- [`typix ui list`](./ui-list.md)
