"use client";

import {
	EditorContent,
	EditorRoot,
	createEditorConfig,
	defaultExtensionNodes,
} from "@typix-editor/react";
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";

const config = createEditorConfig({
	extensionNodes: defaultExtensionNodes,
});

export default function AutoLinkExample() {
	return (
		<EditorRoot config={config}>
			<EditorContent
				placeholder="Type a URL (e.g. https://typix.dev)..."
				className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
			/>
			<AutoLinkExtension />
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
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function AutoLinkExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Type a URL (e.g. https://typix.dev)..." />
      <AutoLinkExtension />
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
