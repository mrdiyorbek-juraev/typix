import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Button,
  Input,
  Badge,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SwitchRoot,
  SwitchThumb,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsPanel,
} from "@typix-editor/ui";

/* ══════════════════════════════════════════════════════════════════
   COLOR DATA
══════════════════════════════════════════════════════════════════ */
type ColorEntry = { name: string; hex: string };
type Palette = {
  bg: string;
  fg: string;
  fgMuted: string;
  border: string;
  groups: Record<string, ColorEntry[]>;
};

const LIGHT: Palette = {
  bg: "#ffffff",
  fg: "#18181b",
  fgMuted: "#71717a",
  border: "#e4e4e7",
  groups: {
    Layout: [
      { name: "background", hex: "#ffffff" },
      { name: "foreground", hex: "#11181c" },
      { name: "divider", hex: "#11111126" },
      { name: "focus", hex: "#006fee" },
    ],
    Content: [
      { name: "content1", hex: "#ffffff" },
      { name: "content2", hex: "#f4f4f5" },
      { name: "content3", hex: "#e4e4e7" },
      { name: "content4", hex: "#d4d4d8" },
    ],
    Base: [
      { name: "default", hex: "#d4d4d8" },
      { name: "primary", hex: "#006fee" },
      { name: "secondary", hex: "#7828c8" },
      { name: "success", hex: "#17c964" },
      { name: "warning", hex: "#f5a524" },
      { name: "danger", hex: "#f31260" },
    ],
    Default: [
      { name: "default-50", hex: "#fafafa" },
      { name: "default-100", hex: "#f4f4f5" },
      { name: "default-200", hex: "#e4e4e7" },
      { name: "default-300", hex: "#d4d4d8" },
      { name: "default-400", hex: "#a1a1aa" },
      { name: "default-500", hex: "#71717a" },
      { name: "default-600", hex: "#52525b" },
      { name: "default-700", hex: "#3f3f46" },
      { name: "default-800", hex: "#27272a" },
      { name: "default-900", hex: "#18181b" },
    ],
    Primary: [
      { name: "primary-50", hex: "#e6f1fe" },
      { name: "primary-100", hex: "#cce3fd" },
      { name: "primary-200", hex: "#99c7fb" },
      { name: "primary-300", hex: "#66aaf9" },
      { name: "primary-400", hex: "#338ef7" },
      { name: "primary-500", hex: "#006fee" },
      { name: "primary-600", hex: "#005bc4" },
      { name: "primary-700", hex: "#004493" },
      { name: "primary-800", hex: "#002e62" },
      { name: "primary-900", hex: "#001731" },
    ],
    Secondary: [
      { name: "secondary-50", hex: "#f2eafa" },
      { name: "secondary-100", hex: "#e4d4f4" },
      { name: "secondary-200", hex: "#c9a9e9" },
      { name: "secondary-300", hex: "#ae7ede" },
      { name: "secondary-400", hex: "#9353d3" },
      { name: "secondary-500", hex: "#7828c8" },
      { name: "secondary-600", hex: "#6020a0" },
      { name: "secondary-700", hex: "#481878" },
      { name: "secondary-800", hex: "#301050" },
      { name: "secondary-900", hex: "#180828" },
    ],
    Success: [
      { name: "success-50", hex: "#e8faf0" },
      { name: "success-100", hex: "#d1f4e0" },
      { name: "success-200", hex: "#a2e9c1" },
      { name: "success-300", hex: "#74dfa2" },
      { name: "success-400", hex: "#45d483" },
      { name: "success-500", hex: "#17c964" },
      { name: "success-600", hex: "#12a150" },
      { name: "success-700", hex: "#0e793c" },
      { name: "success-800", hex: "#095028" },
      { name: "success-900", hex: "#052814" },
    ],
    Warning: [
      { name: "warning-50", hex: "#fefce8" },
      { name: "warning-100", hex: "#fdeed3" },
      { name: "warning-200", hex: "#fbdba7" },
      { name: "warning-300", hex: "#f9c97c" },
      { name: "warning-400", hex: "#f7b750" },
      { name: "warning-500", hex: "#f5a524" },
      { name: "warning-600", hex: "#c48410" },
      { name: "warning-700", hex: "#938316" },
      { name: "warning-800", hex: "#62420e" },
      { name: "warning-900", hex: "#312107" },
    ],
    Danger: [
      { name: "danger-50", hex: "#fee7ef" },
      { name: "danger-100", hex: "#fdd0df" },
      { name: "danger-200", hex: "#faa0bf" },
      { name: "danger-300", hex: "#f871a0" },
      { name: "danger-400", hex: "#f54180" },
      { name: "danger-500", hex: "#f31260" },
      { name: "danger-600", hex: "#c20e4d" },
      { name: "danger-700", hex: "#920b3a" },
      { name: "danger-800", hex: "#610726" },
      { name: "danger-900", hex: "#310413" },
    ],
  },
};

const DARK: Palette = {
  bg: "#000000",
  fg: "#ecedee",
  fgMuted: "#a1a1aa",
  border: "#27272a",
  groups: {
    Layout: [
      { name: "background", hex: "#000000" },
      { name: "foreground", hex: "#ecedee" },
      { name: "divider", hex: "#ffffff26" },
      { name: "focus", hex: "#006fee" },
    ],
    Content: [
      { name: "content1", hex: "#18181b" },
      { name: "content2", hex: "#27272a" },
      { name: "content3", hex: "#3f3f46" },
      { name: "content4", hex: "#52525b" },
    ],
    Base: [
      { name: "default", hex: "#3f3f46" },
      { name: "primary", hex: "#006fee" },
      { name: "secondary", hex: "#9353d3" },
      { name: "success", hex: "#17c964" },
      { name: "warning", hex: "#f5a524" },
      { name: "danger", hex: "#f31260" },
    ],
    Default: [
      { name: "default-50", hex: "#18181b" },
      { name: "default-100", hex: "#27272a" },
      { name: "default-200", hex: "#3f3f46" },
      { name: "default-300", hex: "#52525b" },
      { name: "default-400", hex: "#71717a" },
      { name: "default-500", hex: "#a1a1aa" },
      { name: "default-600", hex: "#d4d4d8" },
      { name: "default-700", hex: "#e4e4e7" },
      { name: "default-800", hex: "#f4f4f5" },
      { name: "default-900", hex: "#fafafa" },
    ],
    Primary: [
      { name: "primary-50", hex: "#001731" },
      { name: "primary-100", hex: "#002e62" },
      { name: "primary-200", hex: "#004493" },
      { name: "primary-300", hex: "#005bc4" },
      { name: "primary-400", hex: "#006fee" },
      { name: "primary-500", hex: "#338ef7" },
      { name: "primary-600", hex: "#66aaf9" },
      { name: "primary-700", hex: "#99c7fb" },
      { name: "primary-800", hex: "#cce3fd" },
      { name: "primary-900", hex: "#e6f1fe" },
    ],
    Secondary: [
      { name: "secondary-50", hex: "#180828" },
      { name: "secondary-100", hex: "#301050" },
      { name: "secondary-200", hex: "#481878" },
      { name: "secondary-300", hex: "#6020a0" },
      { name: "secondary-400", hex: "#7828c8" },
      { name: "secondary-500", hex: "#9353d3" },
      { name: "secondary-600", hex: "#ae7ede" },
      { name: "secondary-700", hex: "#c9a9e9" },
      { name: "secondary-800", hex: "#e4d4f4" },
      { name: "secondary-900", hex: "#f2eafa" },
    ],
    Success: [
      { name: "success-50", hex: "#052814" },
      { name: "success-100", hex: "#095028" },
      { name: "success-200", hex: "#0e793c" },
      { name: "success-300", hex: "#12a150" },
      { name: "success-400", hex: "#17c964" },
      { name: "success-500", hex: "#45d483" },
      { name: "success-600", hex: "#74dfa2" },
      { name: "success-700", hex: "#a2e9c1" },
      { name: "success-800", hex: "#d1f4e0" },
      { name: "success-900", hex: "#e8faf0" },
    ],
    Warning: [
      { name: "warning-50", hex: "#312107" },
      { name: "warning-100", hex: "#62420e" },
      { name: "warning-200", hex: "#938316" },
      { name: "warning-300", hex: "#c48410" },
      { name: "warning-400", hex: "#f5a524" },
      { name: "warning-500", hex: "#f7b750" },
      { name: "warning-600", hex: "#f9c97c" },
      { name: "warning-700", hex: "#fbdba7" },
      { name: "warning-800", hex: "#fdeed3" },
      { name: "warning-900", hex: "#fefce8" },
    ],
    Danger: [
      { name: "danger-50", hex: "#310413" },
      { name: "danger-100", hex: "#610726" },
      { name: "danger-200", hex: "#920b3a" },
      { name: "danger-300", hex: "#c20e4d" },
      { name: "danger-400", hex: "#f31260" },
      { name: "danger-500", hex: "#f54180" },
      { name: "danger-600", hex: "#f871a0" },
      { name: "danger-700", hex: "#faa0bf" },
      { name: "danger-800", hex: "#fdd0df" },
      { name: "danger-900", hex: "#fee7ef" },
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────────────── */
function lum(hex: string) {
  const c = hex.replace("#", "").slice(0, 6);
  if (c.length < 6) return 0.5;
  return (
    (0.2126 * parseInt(c.slice(0, 2), 16)) / 255 +
    (0.7152 * parseInt(c.slice(2, 4), 16)) / 255 +
    (0.0722 * parseInt(c.slice(4, 6), 16)) / 255
  );
}

/* ── Color components ─────────────────────────────────────────────── */
function Swatch({
  name,
  hex,
  fg,
  muted,
}: {
  name: string;
  hex: string;
  fg: string;
  muted: string;
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 72 }}
    >
      <div
        style={{
          width: 72,
          height: 48,
          background: hex,
          borderRadius: 8,
          flexShrink: 0,
          border: lum(hex) > 0.65 ? "1px solid rgba(0,0,0,0.08)" : "none",
        }}
      />
      <div
        style={{ fontSize: 10, fontWeight: 500, color: fg, lineHeight: 1.3 }}
      >
        {name}
      </div>
      <div style={{ fontSize: 9, color: muted, fontFamily: "monospace" }}>
        {hex}
      </div>
    </div>
  );
}

function ColorGroup({
  label,
  swatches,
  fg,
  fgMuted,
  border,
}: {
  label: string;
  swatches: ColorEntry[];
  fg: string;
  fgMuted: string;
  border: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: fg,
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: `1px solid ${border}`,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {swatches.map((s) => (
          <Swatch
            key={s.name}
            name={s.name}
            hex={s.hex}
            fg={fg}
            muted={fgMuted}
          />
        ))}
      </div>
    </div>
  );
}

function ColorsPanel() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const p = mode === "light" ? LIGHT : DARK;
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {(["light", "dark"] as const).map((m) => {
          const on = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: "5px 16px",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 6,
                border: "1px solid",
                borderColor: on ? "#006fee" : "#e4e4e7",
                background: on ? "#006fee" : "transparent",
                color: on ? "#ffffff" : "#71717a",
                cursor: "pointer",
              }}
            >
              {m === "light" ? "Light colors" : "Dark colors"}
            </button>
          );
        })}
      </div>
      <div
        style={{
          background: p.bg,
          borderRadius: 12,
          padding: 28,
          border: `1px solid ${p.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {Object.entries(p.groups).map(([label, swatches]) => (
          <ColorGroup
            key={label}
            label={label}
            swatches={swatches as ColorEntry[]}
            fg={p.fg}
            fgMuted={p.fgMuted}
            border={p.border}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 56 }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#a8a29e",
          marginBottom: 20,
          marginTop: 0,
          paddingBottom: 8,
          borderBottom: "1px solid #e7e5e4",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── Overview ─────────────────────────────────────────────────────── */
function OverviewStory() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        maxWidth: 1024,
        margin: "0 auto",
        padding: "40px 32px",
        color: "#1c1917",
      }}
    >
      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: "0 0 6px",
          }}
        >
          Typix UI Design System
        </h1>
        <p style={{ fontSize: 13, color: "#78716c", margin: 0 }}>
          Colors · spacing · radius · typography · shadows · components
        </p>
      </div>

      {/* Colors — always first */}
      <Section title="Colors">
        <p style={{ fontSize: 12, color: "#78716c", margin: "0 0 20px" }}>
          Common colors and semantic sets. Semantic colors adapt when switching
          light ↔ dark.
        </p>
        <ColorsPanel />
      </Section>

      {/* Buttons */}
      <Section title="Buttons — Colors × Variants">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(
            [
              "default",
              "primary",
              "secondary",
              "success",
              "warning",
              "danger",
            ] as const
          ).map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#a8a29e",
                  width: 80,
                  flexShrink: 0,
                  fontFamily: "monospace",
                }}
              >
                {color}
              </span>
              <Button variant="solid" color={color} size="sm">
                Solid
              </Button>
              <Button variant="bordered" color={color} size="sm">
                Bordered
              </Button>
              <Button variant="light" color={color} size="sm">
                Light
              </Button>
              <Button variant="flat" color={color} size="sm">
                Flat
              </Button>
              <Button variant="shadow" color={color} size="sm">
                Shadow
              </Button>
              <Button variant="ghost" color={color} size="sm">
                Ghost
              </Button>
              <Button variant="solid" color={color} size="sm" isIconOnly>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="1em"
                  height="1em"
                >
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </Button>
              <Button variant="solid" color={color} size="sm" disabled>
                Off
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs — Sizes & States">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            maxWidth: 320,
          }}
        >
          <Input inputSize="sm" placeholder="Small (26px)" />
          <Input inputSize="md" placeholder="Medium (30px)" />
          <Input inputSize="lg" placeholder="Large (34px)" />
          <Input inputSize="md" placeholder="Ghost" variant="ghost" />
          <Input inputSize="md" placeholder="Disabled" disabled />
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges — Variants">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Badge color="default" size="md">
            Default
          </Badge>
          <Badge color="primary" size="md">
            Primary
          </Badge>
          <Badge color="secondary" size="md">
            Secondary
          </Badge>
          <Badge color="success" size="md">
            Success
          </Badge>
          <Badge color="warning" size="md">
            Warning
          </Badge>
          <Badge color="danger" size="md">
            Danger
          </Badge>
          <Badge variant="bordered" color="default" size="md">
            Outline
          </Badge>
          <Badge color="primary" size="sm">
            Small
          </Badge>
          <Badge color="danger" size="sm">
            Small
          </Badge>
        </div>
      </Section>

      {/* Components */}
      <Section title="Components Preview">
        <div
          style={{
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ minWidth: 180 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#a8a29e",
                marginBottom: 8,
              }}
            >
              SELECT
            </div>
            <SelectRoot defaultValue="apple">
              <SelectTrigger>
                <SelectValue placeholder="Choose…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">
                  <SelectItemText>Apple</SelectItemText>
                </SelectItem>
                <SelectItem value="banana">
                  <SelectItemText>Banana</SelectItemText>
                </SelectItem>
                <SelectItem value="cherry">
                  <SelectItemText>Cherry</SelectItemText>
                </SelectItem>
              </SelectContent>
            </SelectRoot>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#a8a29e",
                marginBottom: 8,
              }}
            >
              SWITCH
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SwitchRoot>
                  <SwitchThumb />
                </SwitchRoot>
                <span style={{ fontSize: 12, color: "#78716c" }}>Off</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SwitchRoot defaultChecked>
                  <SwitchThumb />
                </SwitchRoot>
                <span style={{ fontSize: 12, color: "#78716c" }}>On</span>
              </div>
            </div>
          </div>

          <div style={{ minWidth: 280 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#a8a29e",
                marginBottom: 8,
              }}
            >
              TABS
            </div>
            <TabsRoot defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsPanel value="overview">
                <p style={{ margin: 0, fontSize: 12, color: "#78716c" }}>
                  Overview content here.
                </p>
              </TabsPanel>
              <TabsPanel value="details">
                <p style={{ margin: 0, fontSize: 12, color: "#78716c" }}>
                  Details content here.
                </p>
              </TabsPanel>
              <TabsPanel value="settings">
                <p style={{ margin: 0, fontSize: 12, color: "#78716c" }}>
                  Settings content here.
                </p>
              </TabsPanel>
            </TabsRoot>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── Meta ─────────────────────────────────────────────────────────── */
const meta: Meta<typeof OverviewStory> = {
  title: "Design System/Overview",
  component: OverviewStory,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Typix UI design system overview: full color palette and component showcase.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof OverviewStory>;
export const Overview: Story = {};
