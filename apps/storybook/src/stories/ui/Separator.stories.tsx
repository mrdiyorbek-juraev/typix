import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Separator } from "@typix-editor/ui";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Visual divider in horizontal or vertical orientation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 40 }}>
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};
