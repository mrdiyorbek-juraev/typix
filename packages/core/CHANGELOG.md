# @typix-editor/core

## 5.0.0

### Major Changes

- **Initial public release.** Headless, framework-agnostic editor API on top of [Lexical](https://lexical.dev) — the foundation every Typix adapter (`@typix-editor/react`, Vue, Svelte) builds on.
- **Static extension system.** `defineExtension({ id, nodes, commands, plugins, addNodeOptions })` replaces the older instance-construction model. Extensions are now plain config objects: cheap to compose, trivial to test, and shareable across adapters.
- **`createTypix()` factory.** Single entry point that wires extensions + theme + content into a `TypixEditor` instance — `editor.lexical`, `editor.chain()`, `editor.commands.*`, `editor.events.*`, `editor.meta()`, `editor.getJSON()`, `editor.getHTML()`.
- **Chain builder.** Fluent command API: `editor.chain().toggleBold().focus().run()`. Mirrored by `editor.can()` for capability checks.
- **Type-safe command registry.** Each extension augments `TypixCommands` via module declaration; consumers get autocomplete on `editor.commands.<id>` and `editor.chain().<id>` without ceremony.
- **Re-exported `@lexical/*` modules** as subpath exports (`@typix-editor/core/lexical/code`, `/lexical/list`, etc.) so consumers don't have to manage Lexical's split-package versions themselves.
- **Server-side serialization helpers** under `@typix-editor/core/lexical/headless` + `/html` for SSR and content export pipelines.

## 1.0.0

- Internal pre-release. Not published to npm.
