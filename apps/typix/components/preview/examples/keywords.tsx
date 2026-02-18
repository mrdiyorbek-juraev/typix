"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import {
  KeywordsExtension,
  KeywordNode,
} from "@typix-editor/extension-keywords";

const config = createEditorConfig({
  extensionNodes: [...defaultExtensionNodes, KeywordNode],
});

export default function KeywordsExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder='Type "congratulations" to see it highlighted...'
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <KeywordsExtension />
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
  KeywordsExtension,
  KeywordNode,
} from "@typix-editor/extension-keywords";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: [...defaultExtensionNodes, KeywordNode],
  theme,
});

export default function KeywordsExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder='Type "congratulations" to see it highlighted...' />
      <KeywordsExtension />
    </EditorRoot>
  );
}`,
  },
  {
    name: "theme.ts",
    lang: "ts",
    code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  hashtag: "typix-hashtag",
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
    code: `.typix-hashtag {
  background-color: rgba(88, 144, 255, 0.15);
  border-bottom: 1px solid rgba(88, 144, 255, 0.3);
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
  },
];
