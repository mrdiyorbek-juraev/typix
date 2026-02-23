# @typix-editor/cli

## 4.1.0

### Minor Changes

- [#59](https://github.com/mrdiyorbek-juraev/typix/pull/59) [`994d9d9`](https://github.com/mrdiyorbek-juraev/typix/commit/994d9d938cb49365158fbcfc98e1e86f894f1b92) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Add `upgrade`, `remove`, `doctor`, and `env` commands to the CLI. Improve `init` with package manager selection. Fix package manager detection to walk up the directory tree so monorepo setups correctly detect pnpm/yarn/bun instead of falling back to npm.

## 4.0.0

### Minor Changes

- [#55](https://github.com/mrdiyorbek-juraev/typix/pull/55) [`2cfef9d`](https://github.com/mrdiyorbek-juraev/typix/commit/2cfef9dc403577fcca14942e6496c829a6a61050) Thanks [@mrdiyorbek-juraev](https://github.com/mrdiyorbek-juraev)! - Update Lexical peer dependencies to `^0.40.0` across all packages. Simplify CLI to extension installation only.

## 3.0.0

### Major Changes

- feat: add Typix UI CLI for adding pre-built editor components to projects
