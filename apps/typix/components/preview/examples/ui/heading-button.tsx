"use client";

import { HeadingButton } from "@typix-editor/ui";
import { ToolbarDemo, ToolbarSeparator } from "./toolbar-demo";

const content =
  "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><p>Click a heading button with your cursor inside a paragraph to toggle it.</p>";

export default function HeadingButtonDemo() {
  return (
    <ToolbarDemo namespace="demo-heading-button" content={content}>
      <HeadingButton level={1} />
      <HeadingButton level={2} />
      <HeadingButton level={3} />
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <HeadingButton level={4} />
      <HeadingButton level={5} />
      <HeadingButton level={6} />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { HeadingButton } from "@typix-editor/ui";

<HeadingButton level={1} />
<HeadingButton level={2} />
<HeadingButton level={3} />`,
  },
];
