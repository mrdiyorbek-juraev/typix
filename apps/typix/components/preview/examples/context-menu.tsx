"use client";

import {
	EditorContent,
	EditorRoot,
	createEditorConfig,
	defaultExtensionNodes,
} from "@typix-editor/react";
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";

const config = createEditorConfig({
	extensionNodes: defaultExtensionNodes,
});

export default function ContextMenuExample() {
	return (
		<EditorRoot config={config}>
			<EditorContent
				placeholder="Right-click to see the context menu..."
				className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
			/>
			<ContextMenuExtension
				options={[
					{
						type: "item",
						key: "cut",
						label: "Cut",
						onSelect: () => {
							document.execCommand("cut");
						},
					},
					{
						type: "item",
						key: "copy",
						label: "Copy",
						onSelect: () => {
							document.execCommand("copy");
						},
					},
					{
						type: "item",
						key: "paste",
						label: "Paste",
						onSelect: () => {
							document.execCommand("paste");
						},
					},
					{ type: "separator", key: "sep1" },
					{
						type: "item",
						key: "delete",
						label: "Delete",
						onSelect: () => {
							document.execCommand("delete");
						},
					},
				]}
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
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

export default function ContextMenuExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder="Right-click to see the context menu..." />
      <ContextMenuExtension
        options={[
          {
            type: "item",
            key: "cut",
            label: "Cut",
            onSelect: () => document.execCommand("cut"),
          },
          {
            type: "item",
            key: "copy",
            label: "Copy",
            onSelect: () => document.execCommand("copy"),
          },
          {
            type: "item",
            key: "paste",
            label: "Paste",
            onSelect: () => document.execCommand("paste"),
          },
          { type: "separator", key: "sep1" },
          {
            type: "item",
            key: "delete",
            label: "Delete",
            onSelect: () => document.execCommand("delete"),
          },
        ]}
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
		code: `.typix-context-menu {
  outline: 0;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.typix-context-menu__item {
  display: flex;
  justify-content: left;
  width: 100%;
  background-color: #fff;
  color: #050505;
  border: 0;
  border-radius: 0px;
  font-size: 15px;
  text-align: left;
  line-height: 20px;
  padding: 8px 14px 8px 8px;
  outline: 0;
  cursor: pointer;
}

.typix-context-menu__item:focus,
.typix-context-menu__item:not([disabled]):active {
  background: #eee;
}

.typix-context-menu__item:disabled {
  color: #aaa;
  cursor: not-allowed;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
	},
];
