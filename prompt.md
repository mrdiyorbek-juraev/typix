# Typix Development Prompts

This file contains useful prompts for AI assistants when working with the Typix codebase.

## Creating a New Extension

```
Create a new Typix extension called [name] in packages/extensions/[name].

The extension should:
- Follow the existing extension structure (package.json, tsconfig.json, tsup.config.ts)
- Export from src/index.ts
- Use @typix-editor scope for the package name
- Include proper TypeScript types
```

## Adding a New Lexical Node

```
Create a new Lexical node called [NodeName] for the [extension-name] extension.

The node should:
- Extend the appropriate Lexical base class
- Implement required static methods (getType, clone, importJSON, exportJSON)
- Include proper TypeScript typing
- Follow Lexical node conventions
```

## Creating a New Command

```
Add a new command called [commandName] to the [extension-name] extension.

The command should:
- Follow the Typix command system patterns
- Include proper TypeScript types for payload
- Be exported from the extension's index
```

## Writing Tests

```
Write tests for the [component/extension/feature] using Vitest.

Tests should:
- Cover main functionality
- Include edge cases
- Follow existing test patterns in the codebase
- Use descriptive test names
```

## Adding React Components

```
Create a React component for [feature] in packages/react.

The component should:
- Be properly typed with TypeScript
- Follow React best practices
- Be exported from the package index
- Work with the Typix editor context
```

## Debugging Issues

```
Help me debug [issue description] in the Typix editor.

Relevant context:
- Extension/package affected: [name]
- Error message: [error]
- Steps to reproduce: [steps]
```

## Code Review

```
Review the following code changes for:
- TypeScript type safety
- Lexical best practices
- Typix architecture patterns
- Potential performance issues
- Missing edge cases
```

## Documentation

```
Write documentation for the [extension/feature] including:
- Overview and purpose
- Installation instructions
- Usage examples
- API reference
- Configuration options
```

## Refactoring

```
Refactor [component/module] to:
- Improve code organization
- Follow Typix patterns
- Maintain backwards compatibility
- Keep the same public API
```

## Performance Optimization

```
Analyze and optimize performance for [feature/component].

Consider:
- Lexical update batching
- React re-render optimization
- Memory usage
- Bundle size impact
```
