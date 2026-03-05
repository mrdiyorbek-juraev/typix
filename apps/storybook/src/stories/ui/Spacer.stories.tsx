import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Spacer } from "@typix-editor/ui";

const meta: Meta<typeof Spacer> = {
  title: "UI/Spacer",
  component: Spacer,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    grow: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Invisible spacing primitive. Use `size` for fixed spacing or `grow` to fill remaining space.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spacer>;

export const Default: Story = {
  args: { size: "md" },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#f4f4f5",
        borderRadius: 8,
        padding: 16,
      }}
    >
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <React.Fragment key={size}>
          <div style={{ fontSize: 13, color: "#666" }}>After "{size}" spacer:</div>
          <Spacer size={size} />
          <div
            style={{
              background: "#e4e4e7",
              padding: 4,
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            Content
          </div>
        </React.Fragment>
      ))}
    </div>
  ),
};

export const Grow: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        height: 40,
        background: "#f4f4f5",
        borderRadius: 8,
        padding: 8,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 13 }}>Left</span>
      <Spacer grow />
      <span style={{ fontSize: 13 }}>Right (grow)</span>
    </div>
  ),
};
