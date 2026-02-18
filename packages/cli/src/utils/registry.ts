export type ExtensionEntry = {
  name: string;
  package: string;
  description: string;
};

export const extensionRegistry: Record<string, ExtensionEntry> = {
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
