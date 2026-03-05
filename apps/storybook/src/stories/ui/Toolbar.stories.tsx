import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarToggle,
  ToolbarSeparator,
  ToolbarButton,
} from "@typix-editor/ui";

const meta: Meta<typeof Toolbar> = {
  title: "UI/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal toolbar built on Base UI Toolbar + Toggle. Supports groups, toggle buttons, action buttons, and separators.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

function BoldIcon() {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
    >
      <path
        d="M5.105 12V3.5H8c1.296 0 2.395.904 2.395 2.175 0 .944-.568 1.63-1.27 1.934.941.252 1.625 1.058 1.625 2.141 0 1.32-1.158 2.25-2.5 2.25H5.105zM7 6.5h.75c.621 0 1-.375 1-.85 0-.474-.379-.85-1-.85H7v1.7zm0 3.8h1c.621 0 1.05-.424 1.05-.9s-.429-.9-1.05-.9H7v1.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
    >
      <path d="M6 12l3-9h1.5l-3 9H6z" fill="currentColor" />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
    >
      <path
        d="M5 3v4.5a2.5 2.5 0 005 0V3h1v4.5a3.5 3.5 0 01-7 0V3h1zM4 12.5h7v1H4v-1z"
        fill="currentColor"
      />
    </svg>
  );
}

function AlignLeftIcon() {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
    >
      <path
        d="M2 3.5h11v1H2zM2 7.5h7v1H2zM2 11.5h11v1H2z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Default: Story = {
  render: () => {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarToggle
            pressed={bold}
            onPressedChange={setBold}
            aria-label="Bold"
          >
            <BoldIcon />
          </ToolbarToggle>
          <ToolbarToggle
            pressed={italic}
            onPressedChange={setItalic}
            aria-label="Italic"
          >
            <ItalicIcon />
          </ToolbarToggle>
          <ToolbarToggle
            pressed={underline}
            onPressedChange={setUnderline}
            aria-label="Underline"
          >
            <UnderlineIcon />
          </ToolbarToggle>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton variant="ghost" size="icon" aria-label="Align left">
            <AlignLeftIcon />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    );
  },
};

export const ButtonsOnly: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton variant="ghost" size="icon" aria-label="Bold">
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton variant="ghost" size="icon" aria-label="Italic">
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton variant="ghost" size="icon" aria-label="Underline">
          <UnderlineIcon />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
};
