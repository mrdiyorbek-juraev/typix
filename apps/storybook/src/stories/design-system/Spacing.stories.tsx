import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/* ── Data ─────────────────────────────────────────────────────────── */
const UNITS = [
  { name: "unit-0", px: 0 },
  { name: "unit-1", px: 4 },
  { name: "unit-2", px: 8 },
  { name: "unit-3", px: 12 },
  { name: "unit-3.5", px: 14 },
  { name: "unit-4", px: 16 },
  { name: "unit-5", px: 20 },
  { name: "unit-6", px: 24 },
  { name: "unit-7", px: 28 },
  { name: "unit-8", px: 32 },
  { name: "unit-9", px: 36 },
  { name: "unit-10", px: 40 },
  { name: "unit-11", px: 44 },
  { name: "unit-12", px: 48 },
  { name: "unit-13", px: 52 },
  { name: "unit-14", px: 56 },
  { name: "unit-15", px: 60 },
  { name: "unit-16", px: 64 },
  { name: "unit-17", px: 68 },
  { name: "unit-18", px: 72 },
  { name: "unit-20", px: 80 },
  { name: "unit-24", px: 96 },
  { name: "unit-28", px: 112 },
  { name: "unit-32", px: 128 },
  { name: "unit-36", px: 144 },
  { name: "unit-40", px: 160 },
  { name: "unit-44", px: 176 },
  { name: "unit-48", px: 192 },
  { name: "unit-52", px: 208 },
  { name: "unit-56", px: 224 },
  { name: "unit-60", px: 240 },
  { name: "unit-64", px: 256 },
  { name: "unit-72", px: 288 },
  { name: "unit-80", px: 320 },
  { name: "unit-96", px: 384 },
  { name: "unit-xs", px: 8 },
  { name: "unit-sm", px: 12 },
  { name: "unit-md", px: 16 },
  { name: "unit-lg", px: 22 },
  { name: "unit-xl", px: 36 },
  { name: "unit-2xl", px: 48 },
  { name: "unit-3xl", px: 80 },
  { name: "unit-4xl", px: 120 },
  { name: "unit-5xl", px: 224 },
  { name: "unit-6xl", px: 288 },
  { name: "unit-7xl", px: 384 },
  { name: "unit-8xl", px: 512 },
  { name: "unit-9xl", px: 640 },
];

const MAX_PX = 640;
const MAX_BAR = 300;

/* ── Component ────────────────────────────────────────────────────── */
function SpacingStory() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "32px 40px",
        maxWidth: 560,
        color: "#18181b",
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          margin: "0 0 4px",
          letterSpacing: "-0.02em",
        }}
      >
        Spacing &amp; Units
      </h1>
      <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 28px" }}>
        Base-4 unit scale plus named semantic sizes.
      </p>

      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 72px 1fr",
          paddingBottom: 8,
          marginBottom: 2,
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#71717a",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Name
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#71717a",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Pixels
        </span>
      </div>

      {/* Rows */}
      {UNITS.map(({ name, px }) => (
        <div
          key={name}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 72px 1fr",
            alignItems: "center",
            padding: "5px 0",
            borderBottom: "1px solid #f4f4f5",
          }}
        >
          <span
            style={{ fontSize: 12, color: "#18181b", fontFamily: "monospace" }}
          >
            {name}
          </span>
          <span style={{ fontSize: 12, color: "#71717a" }}>{px}px</span>
          {px > 0 ? (
            <div
              style={{
                height: 8,
                borderRadius: 2,
                background: "#006fee",
                width: Math.max(3, (px / MAX_PX) * MAX_BAR),
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ── Meta ─────────────────────────────────────────────────────────── */
const meta: Meta<typeof SpacingStory> = {
  title: "Design System/Spacing",
  component: SpacingStory,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof SpacingStory>;
export const Spacing: Story = {};
