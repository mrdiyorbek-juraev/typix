import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TextareaAutosize } from "@typix-editor/ui";

const meta: Meta<typeof TextareaAutosize> = {
  title: "UI/TextareaAutosize",
  component: TextareaAutosize,
  tags: ["autodocs"],
  argTypes: {
    minRows: { control: { type: "number", min: 1, max: 20 } },
    maxRows: { control: { type: "number", min: 1, max: 20 } },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Auto-growing textarea that expands vertically as the user types. Supports min/max row constraints.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextareaAutosize>;

export const Default: Story = {
  args: { placeholder: "Start typing..." },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
};

export const WithRowLimits: Story = {
  args: { minRows: 3, maxRows: 6, placeholder: "Min 3 rows, max 6 rows" },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
};

export const Disabled: Story = {
  args: { placeholder: "Disabled textarea", disabled: true },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
};
