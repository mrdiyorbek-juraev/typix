import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectSeparator,
  SelectGroupLabel,
} from "@typix-editor/ui";

const meta: Meta<typeof SelectRoot> = {
  title: "UI/Select",
  component: SelectRoot,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Select built on Base UI's Select primitive. Provides accessible listbox with keyboard navigation, search, and grouping.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectRoot>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>("");
    return (
      <div style={{ padding: 80, maxWidth: 240 }}>
        <p style={{ marginBottom: 8, fontSize: 13, color: "#78716c" }}>
          Selected: {value || "none"}
        </p>
        <SelectRoot value={value} onValueChange={(v) => setValue(v as string)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple"><SelectItemText>Apple</SelectItemText></SelectItem>
            <SelectItem value="banana"><SelectItemText>Banana</SelectItemText></SelectItem>
            <SelectItem value="cherry"><SelectItemText>Cherry</SelectItemText></SelectItem>
            <SelectItem value="date"><SelectItemText>Date</SelectItemText></SelectItem>
          </SelectContent>
        </SelectRoot>
      </div>
    );
  },
};

export const WithGroups: Story = {
  name: "With Groups & Separator",
  render: () => (
    <div style={{ padding: 80, maxWidth: 240 }}>
      <SelectRoot defaultValue="apple">
        <SelectTrigger>
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroupLabel>Fruits</SelectGroupLabel>
          <SelectItem value="apple"><SelectItemText>Apple</SelectItemText></SelectItem>
          <SelectItem value="banana"><SelectItemText>Banana</SelectItemText></SelectItem>
          <SelectSeparator />
          <SelectGroupLabel>Vegetables</SelectGroupLabel>
          <SelectItem value="carrot"><SelectItemText>Carrot</SelectItemText></SelectItem>
          <SelectItem value="broccoli"><SelectItemText>Broccoli</SelectItemText></SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: 80, maxWidth: 240 }}>
      <SelectRoot disabled defaultValue="apple">
        <SelectTrigger>
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple"><SelectItemText>Apple</SelectItemText></SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  name: "With Disabled Item",
  render: () => (
    <div style={{ padding: 80, maxWidth: 240 }}>
      <SelectRoot>
        <SelectTrigger>
          <SelectValue placeholder="Choose a plan…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free"><SelectItemText>Free</SelectItemText></SelectItem>
          <SelectItem value="pro"><SelectItemText>Pro</SelectItemText></SelectItem>
          <SelectItem value="enterprise" disabled>
            <SelectItemText>Enterprise (coming soon)</SelectItemText>
          </SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  ),
};
