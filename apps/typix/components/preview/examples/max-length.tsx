"use client";

import { useState } from "react";
import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import { MaxLengthExtension } from "@typix-editor/extension-max-length";

const MAX = 280;

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

export default function MaxLengthExample() {
  const [count, setCount] = useState(0);

  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder="Start typing (max 280 characters)..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <MaxLengthExtension
        maxLength={MAX}
        onChange={(current) => setCount(current)}
      />
      <div className="mt-2 text-right text-xs text-fd-muted-foreground">
        {count}/{MAX}
      </div>
    </EditorRoot>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { useState } from "react";
import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import { MaxLengthExtension } from "@typix-editor/extension-max-length";
import { theme } from "./theme";
import "./style.css";

const MAX = 280;

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function MaxLengthExample() {
  const [count, setCount] = useState(0);

  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Start typing (max 280 characters)..." />
      <MaxLengthExtension
        maxLength={MAX}
        onChange={(current) => setCount(current)}
      />
      <div className="counter">
        {count}/{MAX}
      </div>
    </EditorRoot>
  );
}`,
  },
  {
    name: "theme.ts",
    lang: "ts",
    code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  characterLimit: "typix-character-limit",
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
    code: `.typix-character-limit {
  display: inline;
  background-color: #ffbbbb !important;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
  },
];
