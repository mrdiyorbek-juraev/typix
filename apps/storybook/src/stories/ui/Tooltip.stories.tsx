import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@typix-editor/ui";

const meta: Meta = {
  title: "UI/Tooltip",
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: { layout: "centered" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ padding: 60 }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Sides: StoryObj = {
  render: () => (
    <div
      style={{
        padding: 80,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        placeItems: "center",
      }}
    >
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithShortcut: StoryObj = {
  render: () => (
    <div style={{ padding: 60, display: "flex", gap: 8 }}>
      {[
        {
          icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
          label: "Edit",
          shortcut: "⌘E",
        },
        {
          icon: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
          label: "Download",
          shortcut: "⌘D",
        },
        {
          icon: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
          label: "Share",
          shortcut: "⌘S",
        },
      ].map(({ icon, label, shortcut }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="16"
                height="16"
              >
                <path d={icon} />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {label}{" "}
            <span style={{ opacity: 0.6, marginLeft: 4 }}>{shortcut}</span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const InsideOverflow: StoryObj = {
  name: "Inside overflow container",
  render: () => (
    <div
      style={{
        padding: 40,
        overflow: "hidden",
        border: "1px dashed var(--border)",
        borderRadius: 8,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Overflow: hidden
          </Button>
        </TooltipTrigger>
        <TooltipContent>Renders in a portal!</TooltipContent>
      </Tooltip>
    </div>
  ),
};
