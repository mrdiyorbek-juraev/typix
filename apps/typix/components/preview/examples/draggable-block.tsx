"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

export default function DraggableBlockExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder="Type some paragraphs, then drag them to reorder..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <DraggableBlockExtension />
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
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function DraggableBlockExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Type paragraphs and drag to reorder..." />
      <DraggableBlockExtension />
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
    code: `.typix-draggable-menu {
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;
  border-radius: 4px;
  padding: 2px 1px;
  opacity: 0;
  will-change: transform;
  transition: background-color 0.15s ease;
}

.typix-draggable-menu:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.typix-draggable-menu:active {
  cursor: grabbing;
}

.typix-draggable-menu__icon {
  width: 16px;
  height: 16px;
  opacity: 0.3;
  color: currentColor;
}

.typix-draggable__target-line {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  pointer-events: none;
  opacity: 0;
  will-change: transform;
  background-color: #5742b3;
  border-radius: 2px;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
  },
];
