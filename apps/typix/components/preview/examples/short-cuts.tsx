"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

export default function ShortCutsExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder="Try Ctrl+B (bold), Ctrl+I (italic), Ctrl+Alt+1 (heading)..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <ShortCutsExtension />
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
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function ShortCutsExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Try keyboard shortcuts..." />
      <ShortCutsExtension />
    </EditorRoot>
  );
}`,
  },
  {
    name: "theme.ts",
    lang: "ts",
    code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  paragraph: "typix-paragraph",
  heading: {
    h1: "typix-heading--h1",
    h2: "typix-heading--h2",
    h3: "typix-heading--h3",
    h4: "typix-heading--h4",
    h5: "typix-heading--h5",
    h6: "typix-heading--h6",
  },
  quote: "typix-quote",
  text: {
    bold: "typix-text--bold",
    italic: "typix-text--italic",
    underline: "typix-text--underline",
    strikethrough: "typix-text--strikethrough",
    underlineStrikethrough: "typix-text--underline-strikethrough",
    code: "typix-text--code",
    subscript: "typix-text--subscript",
    superscript: "typix-text--superscript",
  },
};`,
  },
  {
    name: "style.css",
    lang: "css",
    code: `.typix-paragraph {
  margin: 0;
  position: relative;
}

.typix-heading--h1 {
  font-size: 24px;
  font-weight: 400;
  margin: 0;
}

.typix-heading--h2 {
  font-size: 15px;
  font-weight: 700;
  color: rgb(101, 103, 107);
  margin: 0;
  text-transform: uppercase;
}

.typix-heading--h3 {
  font-size: 12px;
  margin: 0;
  text-transform: uppercase;
}

.typix-quote {
  margin: 0 0 10px 20px;
  color: rgb(101, 103, 107);
  border-left: 4px solid rgb(206, 208, 212);
  padding-left: 16px;
}

.typix-text--bold { font-weight: bold; }
.typix-text--italic { font-style: italic; }
.typix-text--underline { text-decoration: underline; }
.typix-text--strikethrough { text-decoration: line-through; }
.typix-text--underline-strikethrough {
  text-decoration: underline line-through;
}
.typix-text--code {
  background-color: rgb(240, 242, 245);
  padding: 1px 0.25rem;
  font-family: Menlo, Consolas, Monaco, monospace;
  font-size: 94%;
}
.typix-text--subscript {
  font-size: 0.8em;
  vertical-align: sub !important;
}
.typix-text--superscript {
  font-size: 0.8em;
  vertical-align: super;
}`,
  },
];
