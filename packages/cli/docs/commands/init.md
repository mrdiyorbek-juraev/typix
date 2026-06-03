# `typix init`

Scaffold a new Typix project from a template.

```
typix init [projectName] [options]
```

## Synopsis

`typix init` creates a fresh project directory containing a fully-configured Typix editor — extensions wired up, theme CSS imported, package manager initialized. Drop in, `pnpm dev`, edit.

Interactive by default. Pass flags to skip prompts in CI / scripts.

---

## Arguments

| Argument | Description | Default |
|---|---|---|
| `projectName` | Name of the new project (becomes the directory name + `package.json` name) | Prompted if omitted |

---

## Options

| Flag | Description |
|---|---|
| `-t, --template <name>` | Template to use. Currently only `next-app` (Next.js App Router) is shipped — see [Templates](#templates) |
| `-p, --package <pm>` | Package manager: `npm` \| `pnpm` \| `yarn` \| `bun`. Prompted if omitted |
| `--extensions <list>` | Comma-separated extensions to preinstall, e.g. `--extensions starter-kit,image,table`. Skips the extension picker |
| `--no-install` | Skip the dependency install step. Useful for CI or when you want to inspect first |
| `--no-cache` | Bypass cache when reading template / registry files |
| `-d, --debug` | Dry-run — print everything that would happen, don't write files or install |

---

## Examples

### Interactive (recommended for first-time users)

```bash
typix init
```

You'll be walked through every choice. Output:

```
┌  Typix CLI v2.0.0
│
◇  Project name?
│  my-typix-app
│
◇  Select a template (Enter to select)
│  ● Next.js App Router (Next 16 + Tailwind v4 + TypeScript)
│
◇  Select a package manager (Enter to select)
│  ● pnpm    o npm    o yarn    o bun
│
◇  Select extensions to preinstall (space to toggle, Enter to confirm)
│  [x] starter-kit (bold/italic/heading/list/...)
│  [x] image
│  [ ] table
│  [ ] mention
│  [ ] slash-command
│  [ ] floating-link
│  [ ] code-block + code-highlight-shiki
│  [ ] markdown-shortcuts
│  [ ] drag-drop-paste
│  ... (full list)
│
◇  Template created at ./my-typix-app
│
◇  Installing dependencies with pnpm...
│
◇  Next steps ─────────╮
│  cd my-typix-app      │
│  pnpm dev             │
╰───────────────────────╯

🚀  Get started at http://localhost:3000
```

### Non-interactive (CI / scripts)

```bash
typix init my-typix-app -t next-app -p pnpm --extensions starter-kit,image,table
```

Skips all prompts. Errors if the target directory already exists.

### Inspect what `init` would do without writing files

```bash
typix init my-typix-app --debug
```

Prints the file tree, package list, and commands — does not touch disk or run `install`.

### Generate the project but skip install (useful for monorepos)

```bash
typix init my-typix-app --no-install
cd my-typix-app
# add to your workspace, then:
pnpm install
```

---

## What gets created

After `init`, the project structure looks like:

```
my-typix-app/
├── app/
│   ├── globals.css            (imports @typix-editor/ui/styles + Tailwind v4)
│   ├── layout.tsx
│   └── page.tsx               (renders <Editor />)
├── components/
│   └── typix/
│       └── editor.tsx         (the <Editor /> component using useTypixEditor)
├── public/
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md                  (Typix-specific quick start)
```

`components/typix/editor.tsx` is wired with:
- `useTypixEditor` hook with all the lifecycle hooks
- `TypixEditorContext.Provider` for downstream consumers
- `EditorContent` with `defaultTheme` and your picked extensions
- A starter toolbar if you ticked the box

---

## Templates

| Name | Framework | Stack | Status |
|---|---|---|---|
| `next-app` | Next.js 16 (App Router) | React 19 + Tailwind v4 + TypeScript + Turbopack | ✅ v1 |
| `vite-react` | Vite + React | React 19 + Tailwind v4 + TypeScript | 🔜 v1.1 |
| `next-pages` | Next.js 16 (Pages Router) | React 19 + Tailwind v4 + TypeScript | 🔜 later |
| `remix` | Remix | TypeScript + Tailwind v4 | 🔜 later |

Add `-t <name>` to pick. Default is `next-app`.

---

## Behind the scenes

1. **Resolve template** — by default `next-app`. Loaded from the CLI package's bundled `templates/` directory.
2. **Copy files** — recursive copy of template into the target directory. Files matching `*.tpl` are processed for placeholder replacement (`{{PROJECT_NAME}}`, `{{EXTENSIONS_IMPORTS}}`, `{{EXTENSIONS_ARRAY}}`).
3. **Replace placeholders** based on user picks:
   - `{{PROJECT_NAME}}` → the project name (everywhere it appears, including `package.json`, `README.md`, etc.)
   - `{{EXTENSIONS_IMPORTS}}` → import lines for picked extensions
   - `{{EXTENSIONS_ARRAY}}` → the extensions array body
4. **Detect package manager** — explicit `-p` flag wins, otherwise prompts.
5. **Install** — runs `<pm> install` in the new directory (skip with `--no-install`).
6. **Print next steps** — `cd <name>` + `<pm> dev`.

---

## Errors and recovery

| Error | Cause | Fix |
|---|---|---|
| `Directory './my-app' already exists and is not empty` | Target dir has files | Pick another name or delete the dir |
| `Template 'foo' not found` | `-t foo` is not a known template | Run `typix init --help` to list templates |
| `Package manager 'corepack' not detected` | The chosen pm isn't installed | Install it, or pick another with `-p` |
| `npm/pnpm/yarn install failed: <error>` | Network or registry issue | Re-run with `--no-install` then install manually |

---

## See also

- [`typix add`](./add.md) — add more extensions after init
- [`typix ui add`](./ui-add.md) — vendor UI components for customization
- [`typix doctor`](./doctor.md) — check your project for issues
