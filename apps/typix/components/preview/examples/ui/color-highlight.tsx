"use client";

import { ColorHighlightButton } from "@typix-editor/ui";
import { ToolbarDemo } from "./toolbar-demo";

const content =
  "<p>Select some text and use the highlight button to apply a background color.</p>";

export default function ColorHighlightDemo() {
  return (
    <ToolbarDemo namespace="demo-color-highlight" content={content}>
      <ColorHighlightButton />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { ColorHighlightButton, HIGHLIGHT_COLOR_VALUES } from "@typix-editor/ui";

<ColorHighlightButton />
// Or with a custom default:
<ColorHighlightButton defaultColor="#fde68a" />`,
  },
];
