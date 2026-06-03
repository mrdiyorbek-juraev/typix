# Templates

How Typix CLI templates work, what `next-app` ships with, and how to add new ones.

## How `typix init` uses templates

Templates live inside the CLI npm package at `src/templates/<name>/`. When `typix init` runs:

1. It locates the template directory by name
2. Recursively copies it into the target project directory
3. Files ending in `.tpl` are processed for placeholder substitution; the `.tpl` extension is stripped on write
4. Plain files are copied byte-for-byte

Placeholders are double-curly-brace tokens like `{{PROJECT_NAME}}`. The substitution map is populated from CLI flags + user prompts:

| Placeholder | Source | Example |
|---|---|---|
| `{{PROJECT_NAME}}` | `init`'s positional arg or prompt | `my-typix-app` |
| `{{EXTENSIONS_IMPORTS}}` | computed from picked extensions | `import { ImageExtension } from "@typix-editor/extension-image"` |
| `{{EXTENSIONS_ARRAY}}` | computed from picked extensions | `const extensions = [StarterKit(), ImageExtension]` |
| `{{EXTENSION_DEPS}}` | computed from picked extensions | `"@typix-editor/extension-image": "^2.0.0"` (for `package.json`) |
| `{{CSS_IMPORTS}}` | computed (always includes design-system) | `@import "@typix-editor/ui/styles";` |
| `{{TYPIX_VERSION}}` | CLI version | `2.0.0` |

---

## `next-app` template

The default (and currently only) template. Next.js 16 App Router, Tailwind v4, TypeScript, Turbopack.

### File tree

```
src/templates/next-app/
├── app/
│   ├── globals.css.tpl              Tailwind + @typix-editor/ui/styles + source declarations
│   ├── layout.tsx
│   └── page.tsx                     renders <Editor />
├── components/
│   └── typix/
│       └── editor.tsx.tpl           the <Editor /> component, parameterized by user picks
├── public/
│   └── favicon.ico
├── .gitignore
├── README.md.tpl                    project-specific quick start
├── next.config.ts
├── package.json.tpl                 with {{PROJECT_NAME}} and {{EXTENSION_DEPS}} placeholders
├── postcss.config.mjs
├── tailwind.config.ts               (mostly empty — Tailwind v4 doesn't need much)
└── tsconfig.json
```

### `components/typix/editor.tsx.tpl` (excerpt)

```tsx
"use client";

import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { configExtension } from "lexical";
{{EXTENSIONS_IMPORTS}}

const extensions = {{EXTENSIONS_ARRAY}};

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    namespace: "{{PROJECT_NAME}}",
    theme: defaultTheme,
    autofocus: "end",
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <TypixEditorContext.Provider value={{ '{{' }} editor {{ '}}' }}>
      <EditorContent
        editor={editor}
        placeholder="Start typing..."
        className="prose max-w-none p-6"
      />
    </TypixEditorContext.Provider>
  );
}
```

> Note: the double-brace literal `{{ '{{' }}` is a template escape — written `\{\{` in the actual `.tpl` file so the JSX `value={{ editor }}` survives substitution unchanged.

### `app/globals.css.tpl`

```css
@import "tailwindcss";
@import "@typix-editor/ui/styles";

/* Source declaration so Tailwind v4 generates classes used in vendored UI components */
@source "../components/typix/**/*.{ts,tsx}";
```

### `package.json.tpl`

```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@typix-editor/core": "^{{TYPIX_VERSION}}",
    "@typix-editor/react": "^{{TYPIX_VERSION}}",
    "@typix-editor/ui": "^{{TYPIX_VERSION}}",
    {{EXTENSION_DEPS}}
    "lexical": "^0.40.0",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0",
    "typescript": "^5.8.0"
  }
}
```

---

## Adding a new template

(For future contributors / Typix maintainers.)

1. Create `src/templates/<name>/` with the file tree above
2. Use `.tpl` extension for any file containing placeholders
3. Register the template in `src/registry/templates.ts`:

   ```ts
   {
     name: "vite-react",
     label: "Vite + React",
     description: "Vite + React 19 + Tailwind v4 + TypeScript",
     dir: "vite-react",
     supportedPackageManagers: ["npm", "pnpm", "yarn", "bun"],
   }
   ```

4. Templates appear automatically in the `typix init` template picker
5. Add docs at `docs/commands/init.md` (template table) + this file (`docs/templates.md`)

---

## Future templates

Planned, not shipped in v1:

| Name | Framework | Notes |
|---|---|---|
| `vite-react` | Vite + React | Next priority. Same setup as next-app sans Next-specific bits. |
| `next-pages` | Next.js Pages Router | For legacy users. |
| `remix` | Remix / React Router | Lower priority; pull request welcome. |
| `astro` | Astro | Editor as an island. Experimental. |

---

## Why bundle templates inside the CLI npm package?

See [architecture.md → decision A](./architecture.md#bundle-the-nextjs-template-inside-the-cli-npm-package-decision-a).

TL;DR: simplest distribution, works offline, version-pinned with the CLI. We can revisit if templates grow beyond a few dozen files.
