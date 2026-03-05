import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Textarea } from "@typix-editor/ui";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 320 }}>
      <Textarea placeholder="Type your message here." />
    </div>
  ),
};

export const AutoResize: StoryObj = {
  render: () => (
    <div
      style={{ width: 320, display: "flex", flexDirection: "column", gap: 8 }}
    >
      <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>
        This textarea auto-expands as you type.
      </p>
      <Textarea
        placeholder="Start typing… the textarea will grow."
        minRows={3}
        maxRows={10}
      />
    </div>
  ),
};

export const WithLabel: StoryObj = {
  render: () => (
    <div
      style={{ width: 320, display: "flex", flexDirection: "column", gap: 6 }}
    >
      <label
        style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}
      >
        Bio
      </label>
      <Textarea placeholder="Tell us a little about yourself." minRows={4} />
      <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>
        Max 160 characters.
      </p>
    </div>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <div style={{ width: 320 }}>
      <Textarea
        disabled
        value="This textarea is disabled and cannot be edited."
        readOnly
        minRows={3}
      />
    </div>
  ),
};
