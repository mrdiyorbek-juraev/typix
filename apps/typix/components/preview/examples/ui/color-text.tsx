"use client";

import { ColorTextButton } from "@typix-editor/ui";
import { ToolbarDemo } from "./toolbar-demo";

const content =
  "<p>Select some text and use the color button to change its color.</p>";

export default function ColorTextDemo() {
  return (
    <ToolbarDemo namespace="demo-color-text" content={content}>
      <ColorTextButton />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { ColorTextButton, TEXT_COLOR_VALUES } from "@typix-editor/ui";

<ColorTextButton />
// Or with a custom default color:
<ColorTextButton defaultColor="#3b82f6" />`,
  },
];
