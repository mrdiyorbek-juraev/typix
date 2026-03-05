import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "@typix-editor/ui";

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "success",
  "warning",
  "blue",
  "purple",
] as const;

const meta: Meta = {
  title: "UI/Badge",
  parameters: { layout: "fullscreen" },
};
export default meta;

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ padding: "32px 24px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
        }}
      >
        {VARIANTS.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => (
    <div
      style={{
        padding: 40,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

export const Status: StoryObj = {
  render: () => (
    <div
      style={{
        padding: 40,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Badge variant="success">Published</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="blue">In review</Badge>
      <Badge variant="purple">Beta</Badge>
    </div>
  ),
};

export const WithDot: StoryObj = {
  render: () => (
    <div
      style={{
        padding: 40,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {(["success", "warning", "destructive", "blue"] as const).map((v) => (
        <Badge key={v} variant={v}>
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "currentColor",
              flexShrink: 0,
            }}
          />
          {v}
        </Badge>
      ))}
    </div>
  ),
};
