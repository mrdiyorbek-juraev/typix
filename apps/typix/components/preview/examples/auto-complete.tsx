"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
} from "@typix-editor/react";
import {
  AutocompleteExtension,
  AutocompleteNode,
} from "@typix-editor/extension-auto-complete";
import "@typix-editor/react/src/styles/main.css";
const config = createEditorConfig({
  extensionNodes: [...defaultExtensionNodes, AutocompleteNode],
  theme: defaultTheme,
});

export default function AutoCompleteExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder="Type a word with 4+ letters (e.g. 'congr')..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <AutocompleteExtension />
    </EditorRoot>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import {
  AutocompleteExtension,
  AutocompleteNode,
} from "@typix-editor/extension-auto-complete";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: [...defaultExtensionNodes, AutocompleteNode],
  theme,
});

export default function AutoCompleteExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Start typing..." />
      <AutocompleteExtension />
    </EditorRoot>
  );
}`,
  },
  {
    name: "theme.ts",
    lang: "ts",
    code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  autocomplete: "typix-autocomplete",
  paragraph: "typix-paragraph",
  text: {
    bold: "typix-text--bold",
    italic: "typix-text--italic",
    underline: "typix-text--underline",
    strikethrough: "typix-text--strikethrough",
    code: "typix-text--code",
  },
};`,
  },
  {
    name: "style.css",
    lang: "css",
    code: `.typix-autocomplete {
  color: #ccc;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
  },
];
