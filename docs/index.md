# Typix Documentation

Welcome to the Typix internal documentation. Each document covers one layer of the architecture in full detail.

---

## Architecture Layers

| Document | Layer | Package(s) |
|---|---|---|
| [Lexical](./lexical.md) | Foundation — the editor engine Typix is built on | `lexical` (Meta) |
| [Core](./core.md) | Headless editor wrapper, extension system, event bridge | `@typix-editor/core` |
| [Extensions](./extensions.md) | Modular feature packages (nodes, commands, shortcuts) | `@typix-editor//*` |
| [Design System](./design-system.md) | CSS tokens, theme, React UI primitives | `@typix-editor/theme`, `@typix-editor/ui` |
| [Adapters](./adapters.md) | Framework bindings (React, Vue, Svelte) | `@typix-editor/react`, … |

Start with [ARCHITECTURE.md](../ARCHITECTURE.md) for the full picture, then dive into any layer doc above.

---

## Quick Reference

### Where does X live?

| Thing | Location |
|---|---|
| Editor state, nodes, commands | Lexical (external) → see [lexical.md](./lexical.md) |
| `createTypix()`, `TypixEditor`, `ChainBuilder` | `@typix-editor/core` → see [core.md](./core.md) |
| `TypixEventEmitter`, event types | `@typix-editor/core` → see [core.md](./core.md) |
| Adding a new feature/node/command | `packages/extensions/` → see [extensions.md](./extensions.md) |
| CSS tokens, dark mode, node styles | `@typix-editor/theme` → see [design-system.md](./design-system.md) |
| UI components (Button, Tooltip, etc.) | `@typix-editor/ui` → see [design-system.md](./design-system.md) |
| React hooks, `<EditorContent />` | `@typix-editor/react` → see [adapters.md](./adapters.md) |
| Vue / Svelte integration | Planned → see [adapters.md](./adapters.md) |

### Dependency direction (top = no deps, bottom = most deps)

```
lexical
  └── @typix-editor/core
        ├── @typix-editor/extensions/*
        ├── @typix-editor/theme          (CSS only, no JS deps)
        └── @typix-editor/react
              └── @typix-editor/ui
```
