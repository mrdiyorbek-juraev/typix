export type ExtensionEntry = {
  name: string;
  package: string;
  description: string;
  /** "core" = Typix runtime packages, "extension" = optional feature extensions. Defaults to "extension". */
  type?: "core" | "extension";
};

export const extensionRegistry: Record<string, ExtensionEntry> = {
  // Core Typix packages — the runtime + framework adapter + helpers most
  // consumer apps install first. Listed before extensions in pickers/list.
  core: {
    name: "core",
    package: "@typix-editor/core",
    description:
      "Headless editor runtime (createTypix, TypixEditor, extension system)",
    type: "core",
  },
  react: {
    name: "react",
    package: "@typix-editor/react",
    description: "React bindings, hooks, and components for Typix",
    type: "core",
  },
  utils: {
    name: "utils",
    package: "@typix-editor/utils",
    description: "Shared utilities used across Typix packages",
    type: "core",
  },
  "starter-kit": {
    name: "starter-kit",
    package: "@typix-editor/extension-starter-kit",
    description: "Bundle of common built-in extensions to get started fast",
  },
  "auto-complete": {
    name: "auto-complete",
    package: "@typix-editor/extension-auto-complete",
    description: "Autocomplete suggestions as you type",
  },
  "auto-link": {
    name: "auto-link",
    package: "@typix-editor/extension-auto-link",
    description: "Automatically detect and convert URLs to links",
  },
  "code-block": {
    name: "code-block",
    package: "@typix-editor/extension-code-block",
    description: "Code block node with language selection and copy support",
  },
  "code-block-prettier": {
    name: "code-block-prettier",
    package: "@typix-editor/extension-code-block-prettier",
    description: "Format code blocks on demand with Prettier",
  },
  "code-highlight-prism": {
    name: "code-highlight-prism",
    package: "@typix-editor/extension-code-highlight-prism",
    description: "Syntax highlighting with Prism.js",
  },
  "code-highlight-shiki": {
    name: "code-highlight-shiki",
    package: "@typix-editor/extension-code-highlight-shiki",
    description: "Syntax highlighting with Shiki",
  },
  "character-limit": {
    name: "character-limit",
    package: "@typix-editor/extension-character-limit",
    description: "Enforce character count limits with visual feedback",
  },
  collapsible: {
    name: "collapsible",
    package: "@typix-editor/extension-collapsible",
    description: "Collapsible/accordion content blocks",
  },
  "context-menu": {
    name: "context-menu",
    package: "@typix-editor/extension-context-menu",
    description: "Custom right-click context menu",
  },
  "drag-drop-paste": {
    name: "drag-drop-paste",
    package: "@typix-editor/extension-drag-drop-paste",
    description: "Handle drag, drop, and paste events",
  },
  "draggable-block": {
    name: "draggable-block",
    package: "@typix-editor/extension-draggable-block",
    description: "Drag and drop reordering of editor blocks",
  },
  "floating-link": {
    name: "floating-link",
    package: "@typix-editor/extension-floating-link",
    description: "Floating link editor toolbar",
  },
  image: {
    name: "image",
    package: "@typix-editor/extension-image",
    description: "Image node with alignment, captions, and resize",
  },
  keywords: {
    name: "keywords",
    package: "@typix-editor/extension-keywords",
    description: "Keyword highlighting and detection",
  },
  link: {
    name: "link",
    package: "@typix-editor/extension-link",
    description: "Link nodes and commands",
  },
  "markdown-shortcuts": {
    name: "markdown-shortcuts",
    package: "@typix-editor/extension-markdown-shortcuts",
    description: "Convert markdown syntax to formatted nodes as you type",
  },
  "max-length": {
    name: "max-length",
    package: "@typix-editor/extension-max-length",
    description: "Enforce maximum content length",
  },
  mention: {
    name: "mention",
    package: "@typix-editor/extension-mention",
    description: "@mention functionality with flexible configuration",
  },
  "short-cuts": {
    name: "short-cuts",
    package: "@typix-editor/extension-short-cuts",
    description: "Keyboard shortcuts for editor actions",
  },
  "slash-command": {
    name: "slash-command",
    package: "@typix-editor/extension-slash-command",
    description: "Slash (/) command palette for inserting nodes and actions",
  },
  "speech-to-text": {
    name: "speech-to-text",
    package: "@typix-editor/extension-speech-to-text",
    description: "Voice input via speech recognition",
  },
  "tab-focus": {
    name: "tab-focus",
    package: "@typix-editor/extension-tab-focus",
    description: "Tab key focus management",
  },
  table: {
    name: "table",
    package: "@typix-editor/extension-table",
    description:
      "Full-featured tables with cell merge, scroll shadow, and rich commands",
  },
  tailwind: {
    name: "tailwind",
    package: "@typix-editor/extension-tailwind",
    description: "Tailwind CSS theme/wiring extension",
  },
};

export function getExtensionEntry(name: string): ExtensionEntry | undefined {
  return extensionRegistry[name];
}

export function getAllExtensions(): ExtensionEntry[] {
  return Object.values(extensionRegistry);
}

export function getExtensionNames(): string[] {
  return Object.keys(extensionRegistry);
}

export function getCorePackages(): ExtensionEntry[] {
  return Object.values(extensionRegistry).filter((e) => e.type === "core");
}

export function getExtensionsOnly(): ExtensionEntry[] {
  return Object.values(extensionRegistry).filter((e) => e.type !== "core");
}
