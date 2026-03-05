import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Button } from "@typix-editor/ui"

const VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const SIZES    = ["sm", "md", "lg"] as const

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", fontFamily: "monospace", whiteSpace: "nowrap" }}>
      {children}
    </span>
  )
}

function ButtonMatrix() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `88px ${SIZES.map(() => "144px 44px").join(" ")}`,
        gap: "8px 12px", marginBottom: 12, paddingBottom: 12,
        borderBottom: "1px solid var(--border)",
      }}>
        <div />
        {SIZES.map(s => (
          <React.Fragment key={s}>
            <Label>size: {s}</Label>
            <div />
          </React.Fragment>
        ))}
      </div>
      {VARIANTS.map(v => (
        <div key={v} style={{
          display: "grid",
          gridTemplateColumns: `88px ${SIZES.map(() => "144px 44px").join(" ")}`,
          gap: "8px 12px", alignItems: "center", marginBottom: 10,
        }}>
          <Label>variant: {v}</Label>
          {SIZES.map(s => (
            <React.Fragment key={s}>
              <Button variant={v} size={s}>Button</Button>
              <Button variant={v} size="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </Button>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

const meta: Meta = {
  title: "UI/Button",
  parameters: { layout: "fullscreen" },
}
export default meta

export const AllVariants: StoryObj = { render: () => <ButtonMatrix /> }

export const Default: StoryObj = {
  render: () => (
    <div style={{ padding: 40, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ padding: 40, display: "flex", gap: 8, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Button>
    </div>
  ),
}

export const WithIcon: StoryObj = {
  render: () => (
    <div style={{ padding: 40, display: "flex", gap: 8, alignItems: "center" }}>
      <Button>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New file
      </Button>
      <Button variant="outline">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        Download
      </Button>
      <Button variant="destructive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
        </svg>
        Delete
      </Button>
    </div>
  ),
}

export const Disabled: StoryObj = {
  render: () => (
    <div style={{ padding: 40, display: "flex", gap: 8, alignItems: "center" }}>
      <Button disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
    </div>
  ),
}
