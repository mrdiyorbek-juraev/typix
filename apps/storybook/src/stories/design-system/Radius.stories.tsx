import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const TOKENS = [
  { name: ".rounded-small",  value: "8px",  px: "8px"  },
  { name: ".rounded-medium", value: "12px", px: "12px" },
  { name: ".rounded-large",  value: "14px", px: "14px" },
  { name: ".rounded-full",   value: "50%",  px: "50%"  },
];

function RadiusStory() {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "32px 40px",
      color: "#18181b",
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
        Radius
      </h1>
      <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 32px" }}>
        Border radius tokens for consistent rounding across components.
      </p>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: 16,
        padding: "40px 48px",
        display: "flex",
        gap: 48,
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}>
        {TOKENS.map(({ name, value, px }) => (
          <div key={name} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 100, height: 100,
              background: "#f4f4f5",
              border: "1px solid #e4e4e7",
              borderRadius: value,
            }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: "#18181b", textAlign: "center" }}>{name}</div>
            <div style={{ fontSize: 11, color: "#71717a" }}>({px})</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof RadiusStory> = {
  title: "Design System/Radius",
  component: RadiusStory,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof RadiusStory>;
export const Radius: Story = {};
