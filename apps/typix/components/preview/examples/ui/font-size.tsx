"use client";

import { FontSizeInput } from "@typix-editor/ui";
import { ToolbarDemo } from "./toolbar-demo";

const content =
  "<p>Click the + / − buttons or type a value to change the font size of the selected text.</p>";

export default function FontSizeDemo() {
  return (
    <ToolbarDemo namespace="demo-font-size" content={content}>
      <FontSizeInput />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { FontSizeInput } from "@typix-editor/ui";

<FontSizeInput />
<FontSizeInput hideWhenUnavailable />`,
  },
];
