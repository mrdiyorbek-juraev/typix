"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import { DragDropPasteExtension } from "@typix-editor/extension-drag-drop-paste";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

export default function DragDropPasteExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent
        placeholder="Try dragging or pasting an image here..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <DragDropPasteExtension
        onValidationError={(_file: File, reason: string) => {
          console.warn("Validation error:", reason);
        }}
      />
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
import { DragDropPasteExtension } from "@typix-editor/extension-drag-drop-paste";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function DragDropPasteExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Try dragging or pasting an image..." />
      <DragDropPasteExtension
        acceptedTypes={["image/png", "image/jpeg"]}
        maxFileSize={5 * 1024 * 1024}
        onFilesAdded={async (files) => {
          // Upload files to your server
          const urls = await uploadFiles(files);
          return urls.map((src) => ({ src }));
        }}
        onValidationError={(file, reason) => {
          console.warn(reason);
        }}
      />
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
  image: "typix-image",
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
    code: `.typix-paragraph {
  margin: 0;
  position: relative;
}

.typix-text--bold { font-weight: bold; }
.typix-text--italic { font-style: italic; }
.typix-text--underline { text-decoration: underline; }
.typix-text--strikethrough { text-decoration: line-through; }
.typix-text--code {
  background-color: rgb(240, 242, 245);
  padding: 1px 0.25rem;
  font-family: Menlo, Consolas, Monaco, monospace;
  font-size: 94%;
}`,
  },
];
