"use client";

import { ListDropdownMenu, ListButton } from "@typix-editor/ui";
import { ToolbarDemo, ToolbarSeparator } from "./toolbar-demo";

const content =
  "<ul><li>Bullet item one</li><li>Bullet item two</li></ul><p>Use the dropdown to switch between bullet, ordered, and checklist types.</p>";

export default function ListDropdownDemo() {
  return (
    <ToolbarDemo namespace="demo-list-dropdown" content={content}>
      <ListDropdownMenu />
      <ToolbarSeparator className="mx-1 h-5 w-px bg-fd-border" />
      <ListButton type="bullet" />
      <ListButton type="ordered" />
      <ListButton type="check" />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { ListDropdownMenu, ListButton } from "@typix-editor/ui";

// Dropdown (switches between types)
<ListDropdownMenu />

// Individual buttons
<ListButton type="bullet" />
<ListButton type="ordered" />
<ListButton type="check" />`,
  },
];
