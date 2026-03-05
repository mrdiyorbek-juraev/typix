import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@typix-editor/ui";

const meta: Meta = {
  title: "UI/Popover",
  parameters: { layout: "centered" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: 4,
            }}
          >
            Dimensions
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              marginBottom: 12,
            }}
          >
            Set the dimensions for the layer.
          </div>
          {["Width", "Height"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  minWidth: 52,
                }}
              >
                {label}
              </label>
              <input
                defaultValue="100%"
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  background: "var(--background)",
                  color: "var(--foreground)",
                  width: 120,
                  outline: "none",
                }}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Alignment: StoryObj = {
  render: () => (
    <div style={{ padding: 80, display: "flex", gap: 12 }}>
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {align}
            </Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-48">
            <p
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              Aligned to <strong>{align}</strong>.
            </p>
          </PopoverContent>
        </Popover>
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Overflow: hidden
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p style={{ fontSize: 13, margin: 0 }}>
            This popover escapes the overflow container.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
