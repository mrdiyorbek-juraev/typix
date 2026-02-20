---
"@typix-editor/cli": minor
---

Add `upgrade`, `remove`, `doctor`, and `env` commands to the CLI. Improve `init` with package manager selection. Fix package manager detection to walk up the directory tree so monorepo setups correctly detect pnpm/yarn/bun instead of falling back to npm.
