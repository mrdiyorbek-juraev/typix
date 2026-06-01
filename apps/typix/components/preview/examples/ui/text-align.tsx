"use client";

import { TextAlignButton } from "@typix-editor/ui";
import { ToolbarDemo } from "./toolbar-demo";

const content =
  "<p>Click an alignment button to change the alignment of this paragraph. Try left, center, right, and justify.</p><p>A second paragraph to test alignment on multiple blocks independently.</p>";

export default function TextAlignDemo() {
  return (
    <ToolbarDemo namespace="demo-text-align" content={content}>
      <TextAlignButton align="left" />
      <TextAlignButton align="center" />
      <TextAlignButton align="right" />
      <TextAlignButton align="justify" />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { TextAlignButton } from "@typix-editor/ui";

<TextAlignButton align="left" />
<TextAlignButton align="center" />
<TextAlignButton align="right" />
<TextAlignButton align="justify" />`,
  },
];
