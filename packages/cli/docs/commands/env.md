# `typix env`

Print environment information about your Typix setup. Useful for bug reports and quick "what version am I on?" checks.

```
typix env [options]
```

## Synopsis

Collects and prints:

- CLI version
- Node version
- Package manager + version
- Operating system + arch
- Project framework (Next.js, Vite, etc.) + version
- React + react-dom versions
- All installed `@typix-editor/*` packages with versions
- Installed `lexical` + `@lexical/*` versions
- Whether `@typix-editor/ui/styles` is imported in CSS
- Whether vendored UI components exist

---

## Options

| Flag | Description |
|---|---|
| `--json` | Output as JSON (for issue reports) |
| `--copy` | Copy the report to clipboard (uses `clipboardy`) |

---

## Examples

### Default

```bash
typix env
```

```
┌  Typix CLI v2.0.0 — Environment
│
│  CLI:
│    @typix-editor/cli                2.0.0
│
│  Runtime:
│    Node                             v22.4.0
│    OS                               Windows 11 (win32 x64)
│    Package manager                  pnpm 10.24.0
│
│  Project:
│    Framework                        Next.js 16.1.6 (App Router)
│    React                            19.2.0
│    React DOM                        19.2.0
│    TypeScript                       5.8.3
│
│  Typix packages:
│    @typix-editor/core               2.0.0
│    @typix-editor/react              2.0.0
│    @typix-editor/ui                 2.0.0
│    @typix-editor/extension-starter  2.0.0
│    @typix-editor/extension-image    2.0.0
│    @typix-editor/extension-table    2.0.0
│
│  Lexical:
│    lexical                          0.40.0
│    @lexical/react                   0.40.0
│    @lexical/extension               0.40.0
│    @lexical/history                 0.40.0
│    (8 more)
│
│  Styles:
│    @typix-editor/ui/styles imported ✓ in ./app/globals.css
│
│  Vendored UI components:
│    ./components/typix/editor-ui/    bubble-menu, floating-link-ui
│
◇  Done
```

### For an issue report

```bash
typix env --copy
```

Copies the formatted report to your clipboard. Paste straight into a GitHub issue.

### Machine-readable

```bash
typix env --json
```

```json
{
  "cli": "2.0.0",
  "runtime": {
    "node": "v22.4.0",
    "os": "Windows 11",
    "arch": "x64",
    "packageManager": { "name": "pnpm", "version": "10.24.0" }
  },
  "project": {
    "framework": "next",
    "frameworkVersion": "16.1.6",
    "react": "19.2.0",
    "reactDom": "19.2.0",
    "typescript": "5.8.3"
  },
  "typix": {
    "@typix-editor/core": "2.0.0",
    "@typix-editor/react": "2.0.0"
  },
  "lexical": {
    "lexical": "0.40.0",
    "@lexical/react": "0.40.0"
  },
  "theme": { "imported": true, "importedIn": "./app/globals.css" },
  "ui": { "vendored": ["bubble-menu", "floating-link-ui"] }
}
```

---

## See also

- [`typix doctor`](./doctor.md) — health checks that go beyond just printing
- [`typix list`](./list.md) — package-only listing
