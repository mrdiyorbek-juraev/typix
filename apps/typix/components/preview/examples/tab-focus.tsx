"use client";

import {
	EditorContent,
	EditorRoot,
	createEditorConfig,
	defaultExtensionNodes,
} from "@typix-editor/react";
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";

const config = createEditorConfig({
	extensionNodes: defaultExtensionNodes,
});

export default function TabFocusExample() {
	return (
		<EditorRoot config={config}>
			<EditorContent
				placeholder="Press Tab to move focus away, Shift+Tab to come back..."
				className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
			/>
			<TabFocusExtension />
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
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function TabFocusExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Press Tab to move focus away..." />
      <TabFocusExtension />
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
