"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
  useTypixEditor,
} from "@typix-editor/react";
import {
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsiblePlugin,
  CollapsibleTitleNode,
  INSERT_COLLAPSIBLE_COMMAND,
} from "@typix-editor/extension-collapsible";

const config = createEditorConfig({
  extensionNodes: [
    ...defaultExtensionNodes,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
  ],
});

function InsertCollapsibleButton() {
  const editor = useTypixEditor();

  return (
    <button
      type="button"
      onClick={() =>
        editor.lexical.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
      }
      className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
    >
      Insert Collapsible
    </button>
  );
}

export default function CollapsibleExample() {
  return (
    <EditorRoot config={config}>
      <div className="mb-3">
        <InsertCollapsibleButton />
      </div>
      <EditorContent
        placeholder="Start typing..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <CollapsiblePlugin />
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
  useTypixEditor,
} from "@typix-editor/react";
import {
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsiblePlugin,
  CollapsibleTitleNode,
  INSERT_COLLAPSIBLE_COMMAND,
} from "@typix-editor/extension-collapsible";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: [
    ...defaultExtensionNodes,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
  ],
  theme,
});

function InsertCollapsibleButton() {
  const editor = useTypixEditor();

  return (
    <button
      onClick={() =>
        editor.lexical.dispatchCommand(
          INSERT_COLLAPSIBLE_COMMAND,
          undefined,
        )
      }
    >
      Insert Collapsible
    </button>
  );
}

export default function CollapsibleExample() {
  return (
    <EditorRoot config={config}>
      <InsertCollapsibleButton />
      <EditorContent placeholder="Start typing..." />
      <CollapsiblePlugin />
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
    code: `/* Collapsible styles are bundled with the extension.
   Import them via: */
@import "@typix-editor/extension-collapsible/style";

/* Base editor styles */
.typix-paragraph {
  margin: 0;
  position: relative;
}

.typix-text--bold { font-weight: bold; }
.typix-text--italic { font-style: italic; }
.typix-text--underline { text-decoration: underline; }
.typix-text--strikethrough { text-decoration: line-through; }`,
  },
];
