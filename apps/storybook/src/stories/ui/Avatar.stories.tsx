import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@typix-editor/ui";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "User avatar built on Base UI Avatar. Supports image with fallback initials and grouping. AvatarFallback accepts a `delay` prop to defer rendering until the image load attempt completes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { size: "md" },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="User avatar" />
      <AvatarFallback delay={600}>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackDelay: Story = {
  name: "Fallback with Delay",
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar size="md">
        <AvatarImage src="https://broken.url/image.jpg" alt="Broken" />
        <AvatarFallback delay={0}>0ms</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src="https://broken.url/image.jpg" alt="Broken" />
        <AvatarFallback delay={600}>600ms</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar size="md">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>+3</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
