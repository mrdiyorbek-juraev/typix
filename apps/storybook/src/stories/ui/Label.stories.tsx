import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Label, Input } from "@typix-editor/ui";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    children: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Form label with optional required indicator. Associates with inputs via `htmlFor`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "Label text" },
};

export const Required: Story = {
  args: { children: "Email", required: true },
};

export const WithInput: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
      <Label htmlFor="demo-name">Name</Label>
      <Input id="demo-name" placeholder="Enter your name" />
    </div>
  ),
};

export const RequiredWithInput: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
      <Label htmlFor="demo-email" required>
        Email
      </Label>
      <Input id="demo-email" type="email" placeholder="Enter your email" />
    </div>
  ),
};
