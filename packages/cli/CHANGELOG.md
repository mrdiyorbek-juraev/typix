# @typix-editor/cli

## 5.0.0

### Major Changes

- **shadcn-style UI vendoring.** New `typix ui add <name>` copies design-system source into the consumer's `components/typix/` folder instead of pulling from `node_modules`. The graph walker resolves the full dependency closure (primitives, lib, styles) and installs missing npm peers (Radix UI packages, lucide-react, etc.) with the project's package manager.
- **Orphan-aware `typix ui remove`.** Before deleting any primitive/lib file, the CLI re-walks the graph over the surviving vendored components so shared primitives stay and only true orphans get removed. `--remove-peers` also uninstalls npm peers no other vendored component needs.
- **`typix ui list` catalog.** Lists every available UI component and marks which are already vendored in the user's project. Supports `--installed`, `--available`, `--all`, `--json`, and `--path <dir>`.
- **`typix.json` is the source of truth.** `typix init` writes the config interactively (component directory, TypeScript flag, Tailwind flag, package manager); every subsequent command reads it.
- **Safe-by-default writes.** `ui add` skips files that already exist; `--overwrite` to force-refresh; `--debug` for a dry run.

### Minor Changes

- Templates for `@typix-editor/ui` are bundled inside the CLI tarball at `dist/templates/ui/`, mirroring `packages/design-system/src/`. Users get the latest design-system every time they install the CLI; the design-system package itself is no longer published.

## 4.1.0

### Minor Changes

- [#59](https://github.com/mrdiyorbek-juraev/typix/pull/59) [`994d9d9`](https://github.com/mrdiyorbek-juraev/typix/commit/994d9d938cb49365158fbcfc98e1e86f894f1b92) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Add `upgrade`, `remove`, `doctor`, and `env` commands to the CLI. Improve `init` with package manager selection. Fix package manager detection to walk up the directory tree so monorepo setups correctly detect pnpm/yarn/bun instead of falling back to npm.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 3.0.0

### Major Changes

- feat: add Typix UI CLI for adding pre-built editor components to projects
