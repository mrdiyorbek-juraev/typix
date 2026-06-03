"use client";

import { MarkButton } from "@typix-editor/ui";
import { ToolbarDemo, ToolbarSeparator } from "./toolbar-demo";

const content =
  "<p>Select any text and click the buttons above to toggle <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, or <code>inline code</code>.</p>";

export default function MarkButtonDemo() {
  return (
    <ToolbarDemo namespace="demo-mark-button" content={content}>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="underline" />
      <MarkButton type="strike" />
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <MarkButton type="code" />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { MarkButton } from "@typix-editor/ui";

<MarkButton type="bold" />
<MarkButton type="italic" />
<MarkButton type="underline" />
<MarkButton type="strike" />
<MarkButton type="code" />
<MarkButton type="superscript" />
<MarkButton type="subscript" />`,
  },
];
