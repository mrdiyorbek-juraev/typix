"use client";

import type { FontFamilyItem } from "@typix-editor/ui";
import { FontFamilyDropdownMenu } from "@typix-editor/ui";
import { ToolbarDemo } from "./toolbar-demo";

const FAMILIES: FontFamilyItem[] = [
  { label: "Default", value: "" },
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Georgia", value: "'Georgia', serif" },
];

const content =
  "<p>Select some text, then use the dropdown to change its font family.</p>";

export default function FontFamilyDemo() {
  return (
    <ToolbarDemo namespace="demo-font-family" content={content}>
      <FontFamilyDropdownMenu families={FAMILIES} />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { FontFamilyDropdownMenu } from "@typix-editor/ui";
import type { FontFamilyItem } from "@typix-editor/ui";

const FAMILIES: FontFamilyItem[] = [
  { label: "Default", value: "" },
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
];

<FontFamilyDropdownMenu families={FAMILIES} />`,
  },
];
