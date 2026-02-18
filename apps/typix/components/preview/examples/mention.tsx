"use client";

import {
	EditorContent,
	EditorRoot,
	createEditorConfig,
	defaultExtensionNodes,
} from "@typix-editor/react";
import {
	MentionExtension,
	MentionNode,
} from "@typix-editor/extension-mention";

const config = createEditorConfig({
	extensionNodes: [...defaultExtensionNodes, MentionNode],
});

const users = [
	{ id: "1", name: "Alice Johnson" },
	{ id: "2", name: "Bob Smith" },
	{ id: "3", name: "Charlie Brown" },
	{ id: "4", name: "Diana Prince" },
	{ id: "5", name: "Edward Norton" },
];

export default function MentionExample() {
	return (
		<EditorRoot config={config}>
			<EditorContent
				placeholder='Type "@" to mention someone...'
				className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
			/>
			<MentionExtension
				onSearch={(query) =>
					users.filter((u) =>
						u.name.toLowerCase().includes(query.toLowerCase()),
					)
				}
				maxSuggestions={5}
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
import {
  MentionExtension,
  MentionNode,
} from "@typix-editor/extension-mention";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: [...defaultExtensionNodes, MentionNode],
  theme,
});

const users = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Charlie Brown" },
];

export default function MentionExample() {
  return (
    <EditorRoot config={config}>
      <EditorContent placeholder='Type "@" to mention someone...' />
      <MentionExtension
        onSearch={(query) =>
          users.filter((u) =>
            u.name.toLowerCase().includes(query.toLowerCase()),
          )
        }
        maxSuggestions={5}
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
		code: `.typix-mention {
  background-color: rgba(24, 119, 232, 0.15);
  border-radius: 4px;
  padding: 2px 4px;
  color: #1877e8;
  cursor: pointer;
}

.typix-mention:hover {
  background-color: rgba(24, 119, 232, 0.25);
}

.typix-mention-menu {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.typix-mention-menu__list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.typix-mention-menu__item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.typix-mention-menu__item:hover,
.typix-mention-menu__item--selected {
  background: #f0f0f0;
}

.typix-paragraph {
  margin: 0;
  position: relative;
}`,
	},
];
