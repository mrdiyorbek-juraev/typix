# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Typix is a modern, extensible rich-text editor framework built on Meta's [Lexical](https://lexical.dev). It provides a headless, framework-agnostic core with opinionated abstractions for building anything from simple text editors to complex document systems.

## Repository Structure

This is a monorepo managed with pnpm workspaces and Turborepo:

```
typix/
├── packages/
│   ├── extensions/          # Editor extensions (modular features)
│   │   ├── auto-complete/
│   │   ├── auto-link/
│   │   ├── code-highlight-prism/
│   │   ├── code-highlight-shiki/
│   │   ├── collapsible/
│   │   ├── drag-drop-paste/
│   │   ├── keywords/
│   │   ├── link/
│   │   ├── max-length/
│   │   └── rich-text/
│   ├── react/               # React integration package
│   ├── next-config/         # Next.js configuration
│   └── typescript-config/   # Shared TypeScript configuration
├── apps/
│   ├── storybook/           # Storybook for component demos
│   └── typix/               # Main Typix application
└── turbo/                   # Turborepo configuration
```

## Common Commands

```bash
# Development
pnpm dev              # Start development servers
pnpm build            # Build all packages

# Code Quality
pnpm lint             # Run Biome linter
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Biome
pnpm typecheck        # Run TypeScript type checking
pnpm test             # Run tests with Vitest

# Versioning & Publishing
pnpm changeset        # Create a changeset for version bumps
pnpm version:packages # Update package versions
pnpm publish:packages # Publish packages to npm

# Maintenance
pnpm clean            # Clean node_modules
pnpm bump-deps        # Update dependencies
```

## Tech Stack

- **Editor Core**: Lexical
- **Package Manager**: pnpm (v10.24.0+)
- **Build System**: Turborepo, tsup
- **Linting/Formatting**: Biome
- **Testing**: Vitest
- **Git Hooks**: Husky
- **Commit Linting**: Commitlint (conventional commits)
- **Versioning**: Changesets
- **Language**: TypeScript
- **UI Framework**: React

## Architecture Principles

1. **Extension-based**: Everything is an extension - nodes, commands, UI, behaviors
2. **Headless First**: No forced UI, full control over rendering
3. **Command-centric**: Centralized command system for editor operations
4. **Type-safe**: Strong TypeScript support throughout

## Commit Convention

This project uses conventional commits. Format: `type(scope): message`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example: `feat(link): add URL validation support`

## Development Notes

- Extensions are self-contained packages under `packages/extensions/`
- Each extension has its own `package.json`, `tsconfig.json`, and `tsup.config.ts`
- The React package (`packages/react/`) provides React-specific bindings
- Use `workspace:*` for internal package dependencies
