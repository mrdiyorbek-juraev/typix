"use client";

import {
	EditorContent,
	EditorRoot,
	createEditorConfig,
	defaultExtensionNodes,
} from "@typix-editor/react";
import { LinkExtension } from "@typix-editor/extension-link";

const config = createEditorConfig({
	extensionNodes: defaultExtensionNodes,
});

export default function LinkExample() {
	return (
		<EditorRoot config={config}>
			<EditorContent
				placeholder="Select text and use Ctrl+K to add a link..."
				className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
			/>
			<LinkExtension />
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
import { LinkExtension } from "@typix-editor/extension-link";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function LinkExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Select text and use Ctrl+K to add a link..." />
      <LinkExtension />
    </EditorRoot>
  );
}`,
	},
	{
		name: "theme.ts",
		lang: "ts",
		code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  link: "typix-link",
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
		code: `.typix-link {
  color: rgb(33, 111, 219);
  text-decoration: none;
}

.typix-link:hover {
  text-decoration: underline;
  cursor: pointer;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
	},
];
