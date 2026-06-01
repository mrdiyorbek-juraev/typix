# `typix ui add`

Vendor (copy) UI components from `@typix-editor/ui` into your project so you fully own and can customize them.

```
typix ui add [components...] [options]
```

## Synopsis

shadcn-style component distribution. Instead of `npm install @typix-editor/ui` and consuming components as a black-box dependency, `typix ui add` **copies the source files** of the components you pick into:

```
<your-project>/components/typix/editor-ui/<component>/
```

You own the code from that moment on — edit, restyle, delete, refactor. No `@typix-editor/ui` version coupling. No `node_modules` indirection.

Imports inside copied files are rewritten so cross-references resolve locally:

```ts
// Original (in @typix-editor/ui)
import { Button } from "@typix-editor/ui";

// After vendoring (in your-project/components/typix/editor-ui/toolbar/index.tsx)
import { Button } from "../button";
```

---

## Arguments

| Argument | Description |
|---|---|
| `components...` | One or more component names. If omitted, an interactive multi-select picker opens. |

See [`typix ui list`](./ui-list.md) for the full catalog.

---

## Options

| Flag | Description |
|---|---|
| `-a, --all` | Vendor every available UI component |
| `--path <dir>` | Override the destination path (default: `./components/typix/editor-ui/`) |
| `--overwrite` | Re-copy components even if they already exist (will overwrite your edits!) |
| `-d, --debug` | Dry-run — show what would be copied without writing files |

---

## Examples

### Interactive

```bash
typix ui add
```

```
┌  Typix CLI v2.0.0
│
◇  Select UI components to vendor (space to toggle)
│  [ ] toolbar              top-level toolbar with mark/block buttons
│  [x] bubble-menu          floating menu on text selection
│  [x] floating-link-ui     popover for editing links
│  [ ] slash-dropdown-menu  / command palette UI
│  [ ] mention-ui           @-mention popup
│  [ ] code-block-ui        code block toolbar (lang picker, copy, format)
│  [ ] table-ui             table cell menu + resizer
│  [ ] draggable-block      drag handle for blocks
│  [ ] context-menu         right-click context menu
│  [ ] character-limit      character count + limit indicator
│
◇  Resolved 2 components + their dependencies:
│   • bubble-menu          → 3 files
│   • floating-link-ui     → 4 files
│   • button (dep)         → 1 file  (shared primitive)
│   • popover (dep)        → 2 files (shared primitive)
│
◇  Target: ./components/typix/editor-ui/
│
◇  Copying files...
│   ✓ components/typix/editor-ui/bubble-menu/index.tsx
│   ✓ components/typix/editor-ui/bubble-menu/types.ts
│   ✓ components/typix/editor-ui/bubble-menu/styles.css
│   ✓ components/typix/editor-ui/floating-link-ui/index.tsx
│   ... etc
│
◇  Installing npm peers: lucide-react, @radix-ui/react-popover
│   pnpm add lucide-react @radix-ui/react-popover
│
◇  Done. Import from "@/components/typix/editor-ui/<name>"
```

### Explicit

```bash
typix ui add toolbar bubble-menu slash-dropdown-menu
```

### Vendor everything (full design system in your project)

```bash
typix ui add --all
```

### Custom destination

```bash
typix ui add toolbar --path ./src/components/editor
```

The CLI replaces `./components/typix/editor-ui/` with your path. Import resolution should still work as long as your `tsconfig.json` paths are set up.

---

## What gets copied per component

Each entry in the UI registry declares its source files, npm peers, and dependencies on other UI components.

Example (toolbar):

```ts
{
  name: "toolbar",
  description: "Top-level toolbar with mark/block buttons",
  files: [
    "main/toolbar/index.tsx",
    "main/toolbar/toolbar.tsx",
    "main/toolbar/toolbar-button.tsx",
    "main/toolbar/toolbar-group.tsx",
    "main/toolbar/toolbar-separator.tsx",
    "main/toolbar/toolbar-spacer.tsx",
  ],
  deps: [],                              // no other UI components needed
  npmPeers: ["lucide-react"],            // installed via package manager
}
```

When you `typix ui add toolbar`:

1. Walk dependencies recursively — pull in any `deps` (e.g., `button`, `separator`)
2. Copy each file from `@typix-editor/ui/src/<files>` to `./components/typix/editor-ui/<component>/<file>`
3. Rewrite imports — `from "@typix-editor/ui"` → `from "../<dep-component>"` or `from "./<local-file>"`
4. Install `npmPeers` via the user's package manager

---

## Available components

See [`typix ui list`](./ui-list.md) for the full catalog with descriptions. Quick list:

| Component | Purpose |
|---|---|
| `toolbar` | Top-level mark/block toolbar |
| `bubble-menu` | Floating menu on text selection |
| `floating-link-ui` | Popover for editing links |
| `slash-dropdown-menu` | `/` command palette |
| `mention-ui` | `@`-mention popup |
| `code-block-ui` | Language picker, copy, format buttons for code blocks |
| `table-ui` | Cell menus, row/column controls, resize handles |
| `draggable-block` | Drag handle that appears next to blocks |
| `context-menu` | Right-click menu (cut, copy, paste, duplicate, delete) |
| `character-limit` | Character count + limit indicator |
| `editor-content-wrapper` | Convenience wrapper bundling EditorContent + common UI |
| `image-renderer` | The React component for rendering image nodes |

Each has dependencies on shared primitives (button, popover, etc.) which are pulled in automatically.

---

## When NOT to vendor

If you're happy with the `@typix-editor/ui` defaults and don't intend to customize them, just `npm install @typix-editor/ui` and consume directly. Vendoring is for users who want:

- Custom styling beyond CSS variables
- Different keyboard interactions
- To remove features they don't need
- To audit / understand the implementation

---

## See also

- [`typix ui list`](./ui-list.md)
- [`typix ui remove`](./ui-remove.md)
- [`typix add`](./add.md) — for installing extensions (the editor behaviors)
