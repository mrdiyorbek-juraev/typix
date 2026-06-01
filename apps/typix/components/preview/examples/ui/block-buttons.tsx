"use client";

import { BlockquoteButton, CodeBlockButton } from "@typix-editor/ui";
import { ToolbarDemo, ToolbarSeparator } from "./toolbar-demo";

const content =
  "<p>Place your cursor in a paragraph and click a button to convert it to a blockquote or code block.</p><blockquote><p>This is a blockquote.</p></blockquote>";

export default function BlockButtonsDemo() {
  return (
    <ToolbarDemo namespace="demo-block-buttons" content={content}>
      <BlockquoteButton />
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <CodeBlockButton />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { BlockquoteButton, CodeBlockButton } from "@typix-editor/ui";

<BlockquoteButton />
<CodeBlockButton />`,
  },
];
