import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const SCALE = [
  { name: "text-tiny",   size: "0.75rem",  lh: "1rem"    },
  { name: "text-small",  size: "0.875rem", lh: "1.25rem" },
  { name: "text-medium", size: "1rem",     lh: "1.5rem"  },
  { name: "text-large",  size: "1.125rem", lh: "1.75rem" },
];

function TypographyStory() {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "32px 40px",
      color: "#18181b",
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
        Typography
      </h1>
      <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 32px" }}>
        Font size and line height scale.
      </p>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: 16,
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}>
        {SCALE.map(({ name, size, lh }) => (
          <div key={name}>
            <div style={{
              fontSize: size,
              lineHeight: lh,
              fontWeight: 500,
              color: "#18181b",
              marginBottom: 5,
            }}>
              {name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#71717a" }}>
              Font Size: {size} | Line Height: {lh}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof TypographyStory> = {
  title: "Design System/Typography",
  component: TypographyStory,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TypographyStory>;
export const Typography: Story = {};
