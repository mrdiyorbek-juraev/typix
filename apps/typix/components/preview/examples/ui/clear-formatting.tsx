"use client";

import { ClearFormattingButton, MarkButton } from "@typix-editor/ui";
import { ToolbarDemo, ToolbarSeparator } from "./toolbar-demo";

const content =
  "<p>Select this <strong>bold and <em>italic</em></strong> text, then click <u>clear formatting</u> to strip all marks at once.</p>";

export default function ClearFormattingDemo() {
  return (
    <ToolbarDemo namespace="demo-clear-formatting" content={content}>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="underline" />
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <ClearFormattingButton />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { ClearFormattingButton } from "@typix-editor/ui";

<ClearFormattingButton />
// hideWhenUnavailable hides it when no formatted text is selected
<ClearFormattingButton hideWhenUnavailable />`,
  },
];
