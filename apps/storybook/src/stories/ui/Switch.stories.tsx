import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Switch } from "@typix-editor/ui"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
}
export default meta

export const Default: StoryObj = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Switch defaultChecked id="sw-default" />
      <label htmlFor="sw-default" style={{ fontSize: 13, color: "var(--foreground)", cursor: "pointer" }}>
        Enable notifications
      </label>
    </div>
  ),
}

export const States: StoryObj = {
  render: () => (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { label: "Unchecked",       props: {} },
        { label: "Checked",         props: { defaultChecked: true } },
        { label: "Disabled (off)",  props: { disabled: true } },
        { label: "Disabled (on)",   props: { disabled: true, defaultChecked: true } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Switch {...props} />
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

export const Controlled: StoryObj = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Switch checked={on} onCheckedChange={setOn} />
        <span style={{ fontSize: 13, color: "var(--foreground)" }}>
          Dark mode: <strong>{on ? "on" : "off"}</strong>
        </span>
      </div>
    )
  },
}

export const FormField: StoryObj = {
  name: "Form field pattern",
  render: () => (
    <div style={{ padding: 24, maxWidth: 320, border: "1px solid var(--border)", borderRadius: 8, background: "var(--card)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { id: "emails",  label: "Email notifications", desc: "Receive updates via email", on: true  },
          { id: "push",    label: "Push notifications",  desc: "Get notified on your device", on: true },
          { id: "weekly",  label: "Weekly digest",       desc: "Summary of activity each week", on: false },
        ].map(({ id, label, desc, on }) => (
          <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{desc}</div>
            </div>
            <Switch defaultChecked={on} />
          </div>
        ))}
      </div>
    </div>
  ),
}
