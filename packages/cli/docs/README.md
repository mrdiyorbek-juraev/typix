# Typix CLI

> The official command-line tool for creating, configuring, and extending Typix editor projects.

```
npx @typix-editor/cli@latest init
```

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Command reference](#command-reference)
- [Global flags](#global-flags)
- [How it's organized](#how-its-organized)

---

## Installation

Two ways to run the CLI:

### `npx` (one-off)

```bash
npx @typix-editor/cli@latest <command>
```

No install required. Always fetches the latest version (or whatever you pin with `@<version>`).

### Global install

```bash
npm install -g @typix-editor/cli
# or
pnpm add -g @typix-editor/cli
# or
yarn global add @typix-editor/cli
# or
bun add -g @typix-editor/cli
```

Then invoke with the short bin name:

```bash
typix <command>
```

Both forms are equivalent. The rest of this documentation uses `typix` for brevity.

---

## Quick start

### 1. Create a new project

```bash
typix init
```

Interactive prompts walk you through template, package manager, and extension picks. Or skip them with flags:

```bash
typix init my-app -t next-app -p pnpm
```

### 2. Run it

```bash
cd my-app
pnpm dev
```

### 3. Add extensions later

```bash
typix add image table mention
```

### 4. Vendor UI components for full customization

```bash
typix ui add toolbar bubble-menu
```

This copies the design-system source into `components/typix/editor-ui/` — you own the code, edit freely.

---

## Command reference

| Command | What it does | Docs |
|---|---|---|
| `typix init [name]` | Scaffold a new Typix project from a template | [init](./commands/init.md) |
| `typix add [exts...]` | Install one or more extensions (npm) | [add](./commands/add.md) |
| `typix remove [exts...]` | Uninstall extensions | [remove](./commands/remove.md) |
| `typix upgrade [exts...]` | Bump extensions to their latest versions | [upgrade](./commands/upgrade.md) |
| `typix list` | List installed Typix packages in the current project | [list](./commands/list.md) |
| `typix ui add [comps...]` | Copy UI components into `components/typix/editor-ui/` | [ui add](./commands/ui-add.md) |
| `typix ui list` | List all available UI components | [ui list](./commands/ui-list.md) |
| `typix ui remove [comps...]` | Delete vendored UI components | [ui remove](./commands/ui-remove.md) |
| `typix doctor` | Diagnose common setup issues | [doctor](./commands/doctor.md) |
| `typix env` | Print environment info (versions, paths, package manager) | [env](./commands/env.md) |
| `typix agents-md` | Generate an `AGENTS.md` for AI coding assistants | [agents-md](./commands/agents-md.md) |

---

## Global flags

These work with every command:

| Flag | Effect |
|---|---|
| `-v, --version` | Print the CLI version and exit |
| `-h, --help` | Show help for the command |
| `--no-cache` | Bypass the 30-minute cache (registry + templates) and refetch |
| `-d, --debug` | Dry-run mode — skip install steps and print everything that would happen |

---

## How it's organized

```
packages/cli/
├── docs/                       you are here
├── src/
│   ├── index.ts                Commander setup + version
│   ├── commands/               one file per command
│   ├── registry/               manifests of available extensions + UI components
│   ├── templates/              project templates (Next.js App Router)
│   └── lib/                    shared helpers (package manager, prompts, fs, ...)
└── dist/                       built output (bundled by tsup)
```

See [architecture](./architecture.md) for the full design and decisions behind it.

---

## Two distinct install models

Typix ships two kinds of installable units. Understanding the split matters:

### Extensions — npm packages

Extensions live on npm as `@typix-editor/extension-<name>`. They contain editor behavior (nodes, commands, listeners) and are consumed by `import`. `typix add bold` runs `pnpm add @typix-editor/extension-starter-kit` and prints the snippet you paste into your editor.

You do **not** own the source. Upgrade by running `typix upgrade bold` or just bumping the version.

### UI components — vendored source

UI components live in the design-system package (`@typix-editor/ui`). `typix ui add toolbar` **copies** the source files into `<your-project>/components/typix/editor-ui/toolbar/` — you own the code from that moment on. Edit it, restyle it, delete pieces.

This is the shadcn/ui distribution model. No `@typix-editor/ui` runtime dep, no version coupling, full freedom to diverge.

---

## Need help?

- Report issues: <https://github.com/mrdiyorbek-juraev/typix/issues>
- Documentation: <https://typix.com>
- Per-command reference: see [`commands/`](./commands/)
