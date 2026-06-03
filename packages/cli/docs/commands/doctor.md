# `typix doctor`

Diagnose common Typix project setup issues.

```
typix doctor [options]
```

## Synopsis

Runs a battery of checks against your project and reports issues with severity + suggested fixes. Inspired by `npx doctor`, `expo-doctor`, `next doctor`.

Exits with code `0` if everything is fine, `1` if any issue with severity `error` is found.

---

## Options

| Flag | Description |
|---|---|
| `--fix` | Attempt to auto-fix issues that have a safe fix (e.g., add missing CSS import, install missing peer dep) |
| `--json` | Output as JSON (for CI) |
| `--no-cache` | Bypass cache when looking up latest versions |

---

## Checks performed

| ID | Category | What it checks | Severity if fails |
|---|---|---|---|
| `core.installed` | Install | `@typix-editor/core` and `@typix-editor/react` are in `package.json` | error |
| `core.versions` | Install | core, react, theme, ui are on matching major versions | warn |
| `core.outdated` | Install | Installed Typix packages are within 1 major of latest npm | info |
| `styles.imported` | CSS | `@typix-editor/ui/styles` is imported in a CSS file (or `globals.css`) | warn |
| `styles.tailwind-source` | CSS | If using `@typix-editor/ui`, the Tailwind `@source` directive points at `packages/design-system/src/**/*.{ts,tsx}` | warn |
| `lexical.versions` | Install | `lexical` and `@lexical/*` are on the version range core's peerDependencies require | error |
| `react.version` | Install | React 18 or 19 installed (matches react-dom version) | error |
| `extension.imports` | Code | All `@typix-editor/extension-*` imports resolve to installed packages | error |
| `editor.usage` | Code | At least one `useTypixEditor` or `<EditorContent>` is found in the project | info |
| `ssr.client-directive` | SSR | Files using `useTypixEditor` start with `"use client"` (Next.js App Router) | warn |
| `vendor.duplicates` | Vendoring | Vendored UI components are not duplicated as installed npm packages | warn |
| `agents-md.exists` | Docs | An `AGENTS.md` file exists at the project root | info |

---

## Examples

### Default run

```bash
typix doctor
```

```
┌  Typix CLI v2.0.0 — Doctor
│
◇  Running 12 checks...
│
│  ✓ core.installed              @typix-editor/core@2.0.0, react@2.0.0
│  ✓ core.versions               all on v2.x
│  ✓ core.outdated               up to date
│  ⚠ styles.imported              @typix-editor/ui/styles is not imported in any CSS file
│                                → Add `@import "@typix-editor/ui/styles";` to ./app/globals.css
│  ✓ styles.tailwind-source       n/a (no @typix-editor/ui installed)
│  ✓ lexical.versions            lexical@0.40.0, all @lexical/* match peer range
│  ✓ react.version               react@19.2.0, react-dom@19.2.0
│  ✓ extension.imports           5 imports, all resolve
│  ✓ editor.usage                useTypixEditor found in ./components/typix/editor.tsx
│  ✓ ssr.client-directive        "use client" present
│  ✓ vendor.duplicates           no duplicates
│  ℹ agents-md.exists            AGENTS.md not found
│                                → Generate with `typix agents-md`
│
◇  1 warning, 1 info, 0 errors
│
ℹ  Re-run with --fix to auto-fix safe issues.
```

### Auto-fix

```bash
typix doctor --fix
```

```
┌  Typix CLI v2.0.0 — Doctor (--fix)
│
◇  Running 12 checks...
│
│  ⚠ styles.imported              @typix-editor/ui/styles not imported
│    → Adding `@import "@typix-editor/ui/styles";` to ./app/globals.css
│    ✓ Fixed
│
◇  1 warning auto-fixed.
```

Auto-fix is **safe**: only applies fixes that don't touch your application code (CSS imports, missing peer deps, etc.). Anything that requires editing your React components or rearranging the editor is just suggested, never applied.

### CI mode

```bash
typix doctor --json
```

```json
{
  "ok": false,
  "summary": { "passed": 10, "warnings": 1, "errors": 1 },
  "checks": [
    {
      "id": "styles.imported",
      "severity": "warn",
      "message": "@typix-editor/ui/styles is not imported in any CSS file",
      "suggestion": "Add `@import \"@typix-editor/ui/styles\";` to ./app/globals.css",
      "autoFixable": true
    }
  ]
}
```

Exits 1 if any `error` severity check fails.

---

## See also

- [`typix env`](./env.md) — printable environment snapshot
- [`typix list`](./list.md) — installed package inventory
