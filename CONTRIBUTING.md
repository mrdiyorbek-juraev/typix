# Contributing to Typix

Thanks for your interest in contributing to Typix! This guide will help you get started.

## Prerequisites

- **Node.js** >= 20 (see `.nvmrc`)
- **pnpm** >= 10.24.0

## Setup

```bash
git clone https://github.com/mrdiyorbek-juraev/typix.git
cd typix
pnpm install
pnpm build
```

## Development

```bash
pnpm dev              # Start dev servers
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm typecheck        # Type-check all packages
pnpm lint             # Lint with Biome
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format with Biome
```

## Project Structure

- `packages/core` — Headless editor API (framework-agnostic)
- `packages/react` — React bindings
- `packages/extensions/` — Modular editor extensions
- `apps/playground` — Local dev sandbox

## Creating an Extension

Each extension lives in `packages/extensions/<name>/` with its own `package.json`, `tsconfig.json`, and `tsup.config.ts`. Extensions must be headless — no React or framework imports.

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): message
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example:** `feat(link): add URL validation support`

Commits are enforced by commitlint via Husky.

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes with tests where appropriate
3. Run `pnpm typecheck && pnpm test && pnpm lint` before pushing
4. Open a PR with a clear description of the change
5. Create a changeset if your change affects published packages: `pnpm changeset`

## Code Style

- TypeScript strict mode enabled
- Biome for linting and formatting — no ESLint/Prettier
- Prefer simple, minimal changes over clever abstractions
