# `typix upgrade`

Bump installed Typix extensions (and optionally core packages) to their latest versions.

```
typix upgrade [extensions...] [options]
```

## Synopsis

Upgrades `@typix-editor/extension-*` packages to the latest version published on npm. Uses your project's package manager so the lockfile stays in sync.

By default, upgrades **only** extensions. Pass `--include-core` to also bump `@typix-editor/core`, `@typix-editor/react`, and `@typix-editor/ui`.

---

## Arguments

| Argument | Description |
|---|---|
| `extensions...` | Extensions to upgrade. If omitted, an interactive multi-select picker shows installed extensions with current vs latest versions. |

---

## Options

| Flag | Description |
|---|---|
| `-a, --all` | Upgrade every installed extension |
| `--include-core` | Also upgrade `@typix-editor/core`, `react`, `theme`, `ui` |
| `--package <pm>` | Force a specific package manager |
| `--no-cache` | Refetch latest versions (bypasses 30-min cache) |
| `-d, --debug` | Dry-run — show what would upgrade without changing anything |

---

## Examples

### Interactive

```bash
typix upgrade
```

```
┌  Typix CLI v2.0.0
│
◇  Fetching latest versions from npm...
│
◇  Select extensions to upgrade (space to toggle)
│  [x] @typix-editor/extension-image       2.0.0  →  2.1.4
│  [x] @typix-editor/extension-table       2.0.0  →  2.0.3
│  [ ] @typix-editor/extension-mention     2.0.0  →  (up to date)
│
◇  Upgrading 2 extensions with pnpm...
│  pnpm add @typix-editor/extension-image@latest @typix-editor/extension-table@latest
│
◇  Done.
│  • @typix-editor/extension-image  2.0.0 → 2.1.4
│  • @typix-editor/extension-table  2.0.0 → 2.0.3
│
⚠  Review the changelogs:
│  https://github.com/mrdiyorbek-juraev/typix/releases
```

### Upgrade everything

```bash
typix upgrade --all --include-core
```

Bumps every Typix package. Use after a major Typix release.

### Dry-run

```bash
typix upgrade --all --debug
```

Prints the version diff without touching anything.

---

## Errors

| Error | Cause | Fix |
|---|---|---|
| `Failed to fetch versions from npm` | Network or registry issue | Re-run with `--no-cache`, or check connectivity |
| `Lockfile out of sync` | Manual edits to `node_modules` | Run `<pm> install` then retry |

---

## See also

- [`typix list`](./list.md) — show installed versions
- [`typix add`](./add.md)
- [`typix remove`](./remove.md)
