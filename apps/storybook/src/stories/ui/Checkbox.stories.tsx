import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Checkbox } from "@typix-editor/ui";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox id="cb-default" defaultChecked />
      <label
        htmlFor="cb-default"
        style={{ fontSize: 13, color: "var(--foreground)", cursor: "pointer" }}
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const States: StoryObj = {
  render: () => (
    <div
      style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14 }}
    >
      {[
        { label: "Unchecked", props: {} },
        { label: "Checked", props: { defaultChecked: true as const } },
        { label: "Disabled", props: { disabled: true } },
        {
          label: "Disabled + checked",
          props: { disabled: true, defaultChecked: true as const },
        },
      ].map(({ label, props }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <Checkbox {...props} />
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const CheckboxGroup: StoryObj = {
  render: () => {
    const items = ["Comments", "Mentions", "Followers", "Likes", "Reposts"];
    const [checked, setChecked] = useState<string[]>(["Comments", "Mentions"]);
    const toggle = (item: string) =>
      setChecked((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );

    return (
      <div
        style={{
          padding: 24,
          maxWidth: 280,
          border: "1px solid var(--border)",
          borderRadius: 8,
          background: "var(--card)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: 12,
          }}
        >
          Notifications
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Checkbox
                id={`cb-${item}`}
                checked={checked.includes(item)}
                onCheckedChange={() => toggle(item)}
              />
              <label
                htmlFor={`cb-${item}`}
                style={{
                  fontSize: 13,
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
