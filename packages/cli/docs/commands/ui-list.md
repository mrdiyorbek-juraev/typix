# `typix ui list`

List UI components available to vendor — and which are already in your project.

```
typix ui list [options]
```

## Synopsis

Inventory of every component in the `@typix-editor/ui` design system. Shows each one's name, short description, dependencies, and whether it's already been vendored into your project.

---

## Options

| Flag | Description |
|---|---|
| `--installed` | Show only components already vendored into `./components/typix/editor-ui/` (or your `--path`) |
| `--available` | Show only components NOT yet vendored |
| `--all` | Show both (default) |
| `--path <dir>` | Override the destination path used for the "installed" check |
| `--json` | Output as JSON (for scripts) |
| `--no-cache` | Bypass registry cache |

---

## Examples

### Default — all components with status

```bash
typix ui list
```

```
┌  Typix CLI v2.0.0
│
◇  UI components (12 total)
│
│  ✓ Already in your project:
│    bubble-menu            floating menu on text selection
│    floating-link-ui       popover for editing links
│
│  + Available to add:
│    toolbar                top-level toolbar with mark/block buttons
│    slash-dropdown-menu    / command palette UI
│    mention-ui             @-mention popup
│    code-block-ui          code block toolbar (lang picker, copy, format)
│    table-ui               table cell menu + resizer
│    draggable-block        drag handle for blocks
│    context-menu           right-click context menu
│    character-limit        character count + limit indicator
│    editor-content-wrapper convenience wrapper
│    image-renderer         React renderer for image nodes
│
◇  Add one: typix ui add <name>
```

### Show dependencies for a specific component

```bash
typix ui list --json
```

```json
{
  "components": [
    {
      "name": "toolbar",
      "description": "Top-level toolbar with mark/block buttons",
      "files": ["main/toolbar/index.tsx", ...],
      "deps": [],
      "npmPeers": ["lucide-react"],
      "installed": false
    },
    {
      "name": "bubble-menu",
      "description": "Floating menu on text selection",
      "files": [...],
      "deps": [],
      "npmPeers": [],
      "installed": true,
      "installedAt": "./components/typix/editor-ui/bubble-menu"
    }
  ]
}
```

Filter with `jq`:

```bash
typix ui list --json | jq '.components[] | select(.installed) | .name'
```

---

## See also

- [`typix ui add`](./ui-add.md)
- [`typix ui remove`](./ui-remove.md)
