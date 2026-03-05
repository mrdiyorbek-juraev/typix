import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/* ── Data ─────────────────────────────────────────────────────────── */
const LEVELS = [
  ".shadow-sm",
  ".shadow",
  ".shadow-md",
  ".shadow-lg",
  ".shadow-xl",
  ".shadow-2xl",
  ".shadow-inner",
] as const;

type Level = (typeof LEVELS)[number];

const COLOR_ROWS: { label: string; bg: string; rgb: string; text: string }[] = [
  { label: "default",   bg: "#ffffff",  rgb: "0,0,0",      text: "#a1a1aa" },
  { label: "primary",   bg: "#006fee",  rgb: "0,111,238",  text: "#ffffff" },
  { label: "secondary", bg: "#7828c8",  rgb: "120,40,200", text: "#ffffff" },
  { label: "success",   bg: "#17c964",  rgb: "23,201,100", text: "#ffffff" },
  { label: "warning",   bg: "#f5a524",  rgb: "245,165,36", text: "#ffffff" },
  { label: "danger",    bg: "#f31260",  rgb: "243,18,96",  text: "#ffffff" },
];

function shadow(level: Level, rgb: string): string {
  const a = (o: number) => `rgba(${rgb},${o})`;
  if (level === ".shadow-inner") return `inset 0 2px 6px ${a(0.3)}`;
  const map: Record<Level, string> = {
    ".shadow-sm":    `0 1px 4px ${a(0.12)}, 0 1px 2px ${a(0.08)}`,
    ".shadow":       `0 2px 8px ${a(0.18)}, 0 1px 3px ${a(0.1)}`,
    ".shadow-md":    `0 4px 16px ${a(0.24)}, 0 2px 6px ${a(0.12)}`,
    ".shadow-lg":    `0 8px 28px ${a(0.32)}, 0 3px 10px ${a(0.14)}`,
    ".shadow-xl":    `0 14px 40px ${a(0.4)}, 0 4px 14px ${a(0.18)}`,
    ".shadow-2xl":   `0 22px 60px ${a(0.5)}, 0 6px 20px ${a(0.22)}`,
    ".shadow-inner": `inset 0 2px 6px ${a(0.3)}`,
  };
  return map[level];
}

/* ── Component ────────────────────────────────────────────────────── */
function ShadowStory() {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "32px 40px",
      color: "#18181b",
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
        Shadow
      </h1>
      <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 32px" }}>
        Box shadow scale applied to each semantic color.
      </p>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: 16,
        padding: "32px 36px",
        overflowX: "auto",
      }}>
        {/* Column labels */}
        <div style={{
          display: "flex", gap: 14, marginBottom: 20,
          paddingBottom: 12, borderBottom: "1px solid #f4f4f5",
        }}>
          {LEVELS.map((lv) => (
            <div key={lv} style={{
              width: 90, flexShrink: 0, fontSize: 10, fontWeight: 500,
              color: "#71717a", textAlign: "center",
            }}>
              {lv}
            </div>
          ))}
        </div>

        {/* Color rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {COLOR_ROWS.map(({ label, bg, rgb, text }) => (
            <div key={label} style={{ display: "flex", gap: 14 }}>
              {LEVELS.map((lv) => (
                <div key={lv} style={{
                  width: 90, height: 80, flexShrink: 0,
                  background: bg,
                  borderRadius: 10,
                  boxShadow: shadow(lv, rgb),
                  border: label === "default" ? "1px solid #f0f0f0" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{
                    fontSize: 9, color: text,
                    fontFamily: "monospace",
                    textAlign: "center",
                    padding: "0 6px",
                    lineHeight: 1.3,
                  }}>
                    {lv}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Meta ─────────────────────────────────────────────────────────── */
const meta: Meta<typeof ShadowStory> = {
  title: "Design System/Shadow",
  component: ShadowStory,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ShadowStory>;
export const Shadow: Story = {};
