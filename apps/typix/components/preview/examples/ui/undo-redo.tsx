"use client";

import { UndoRedoButton } from "@typix-editor/ui";
import { ToolbarDemo } from "./toolbar-demo";

const content =
  "<p>Make some edits — type, delete, format — then use the undo and redo buttons to step through history.</p>";

export default function UndoRedoDemo() {
  return (
    <ToolbarDemo namespace="demo-undo-redo" content={content}>
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToolbarDemo>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import { UndoRedoButton } from "@typix-editor/ui";

<UndoRedoButton action="undo" />
<UndoRedoButton action="redo" />`,
  },
];
