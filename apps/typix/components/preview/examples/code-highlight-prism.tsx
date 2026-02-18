"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

export default function CodeHighlightPrismExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder="Use the shortcut Ctrl+Shift+C to insert a code block..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <CodeHighlightPrismExtension />
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
import { CodeHighlightPrismExtension } from "@typix-editor/extension-code-highlight-prism";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function CodeHighlightPrismExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Insert a code block..." />
      <CodeHighlightPrismExtension />
    </EditorRoot>
  );
}`,
  },
  {
    name: "theme.ts",
    lang: "ts",
    code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  code: "typix-code",
  codeHighlight: {
    comment: "typix-token--comment",
    punctuation: "typix-token--punctuation",
    property: "typix-token--property",
    selector: "typix-token--selector",
    operator: "typix-token--operator",
    attr: "typix-token--attr",
    variable: "typix-token--variable",
    function: "typix-token--function",
  },
  paragraph: "typix-paragraph",
};`,
  },
  {
    name: "style.css",
    lang: "css",
    code: `.typix-code {
  background-color: rgb(240, 242, 245);
  font-family: Menlo, Consolas, Monaco, monospace;
  display: block;
  line-height: 1.53;
  font-size: 13px;
  margin: 8px 0;
  overflow-x: auto;
  position: relative;
  tab-size: 2;
  white-space: pre;
}

.typix-token--comment { color: slategray; }
.typix-token--punctuation { color: #999; }
.typix-token--property { color: #905; }
.typix-token--selector { color: #690; }
.typix-token--operator { color: #9a6e3a; }
.typix-token--attr { color: #07a; }
.typix-token--variable { color: #e90; }
.typix-token--function { color: #dd4a68; }`,
  },
];
