"use client";

import {
	EditorContent,
	EditorRoot,
	createEditorConfig,
	defaultExtensionNodes,
} from "@typix-editor/react";
import { LinkExtension } from "@typix-editor/extension-link";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";

const config = createEditorConfig({
	extensionNodes: defaultExtensionNodes,
});

export default function FloatingLinkExample() {
	return (
		<EditorRoot config={config}>
			<EditorContent
				placeholder="Select text, then use Ctrl+K to insert a link..."
				className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
			/>
			<LinkExtension />
			<FloatingLinkExtension />
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
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function FloatingLinkExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Select text, then use Ctrl+K to insert a link..." />
      <LinkExtension />
      <FloatingLinkExtension />
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

.typix-floating-link {
  display: flex;
  position: absolute;
  z-index: 20;
  max-width: 400px;
  width: max-content;
  opacity: 0;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  font-size: 13px;
  color: #111;
}

.typix-floating-link__view {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 6px 6px 10px;
  width: 100%;
}

.typix-floating-link__url {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 0;
  padding: 4px 6px;
  border-radius: 4px;
  color: #111;
  text-decoration: none;
  transition: background-color 120ms ease;
}

.typix-floating-link__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #666;
  cursor: pointer;
}

.typix-floating-link__btn:hover {
  background-color: #f0f0f0;
  color: #111;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
	},
];
