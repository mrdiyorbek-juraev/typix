import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Input } from "@typix-editor/ui";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    inputSize: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["default", "ghost"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Text input with size and variant support. Supports ghost variant for minimal styling.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text...", inputSize: "md" },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 320,
      }}
    >
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium (default)" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
};

export const Ghost: Story = {
  args: { variant: "ghost", placeholder: "Ghost variant" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
