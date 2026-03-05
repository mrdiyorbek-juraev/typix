import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Kbd } from "@typix-editor/ui"

const meta: Meta = {
  title: "UI/Kbd",
  parameters: { layout: "centered" },
}
export default meta

export const Default: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
}

export const Combinations: StoryObj = {
  render: () => (
    <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        { label: "Command palette",    keys: ["⌘", "K"] },
        { label: "Save",               keys: ["⌘", "S"] },
        { label: "Undo",               keys: ["⌘", "Z"] },
        { label: "Find",               keys: ["⌘", "F"] },
        { label: "Copy",               keys: ["⌘", "C"] },
        { label: "Select all",         keys: ["⌘", "A"] },
        { label: "Close tab",          keys: ["⌘", "W"] },
        { label: "Escape",             keys: ["Esc"] },
        { label: "New line",           keys: ["⇧", "↵"] },
      ].map(({ label, keys }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 280 }}>
          <span style={{ fontSize: 13, color: "var(--foreground)" }}>{label}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const InContext: StoryObj = {
  render: () => (
    <div style={{ padding: 40, maxWidth: 340 }}>
      <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "0 0 12px" }}>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette, or <Kbd>⌘</Kbd> <Kbd>P</Kbd> to search files.
      </p>
    </div>
  ),
}
