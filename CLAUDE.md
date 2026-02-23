# CLAUDE.md

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

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
