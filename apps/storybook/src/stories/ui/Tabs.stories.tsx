import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TabsRoot, TabsList, TabsTrigger, TabsPanel } from "@typix-editor/ui";

const meta: Meta<typeof TabsRoot> = {
  title: "UI/Tabs",
  component: TabsRoot,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tabs built on Base UI. Underline-style navigation with stone neutrals. Supports controlled and uncontrolled usage.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabsRoot>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 40, maxWidth: 480 }}>
      <TabsRoot defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsPanel value="overview">
          <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
            Overview content — project summary, key stats, and recent activity at a glance.
          </p>
        </TabsPanel>
        <TabsPanel value="settings">
          <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
            Settings content — configure preferences, integrations, and permissions.
          </p>
        </TabsPanel>
        <TabsPanel value="activity">
          <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
            Activity log — a chronological record of changes and events.
          </p>
        </TabsPanel>
      </TabsRoot>
    </div>
  ),
};

export const WithDisabledTab: Story = {
  name: "With Disabled Tab",
  render: () => (
    <div style={{ padding: 40, maxWidth: 480 }}>
      <TabsRoot defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security" disabled>Security (locked)</TabsTrigger>
        </TabsList>
        <TabsPanel value="general">
          <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
            General settings content.
          </p>
        </TabsPanel>
        <TabsPanel value="billing">
          <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
            Billing settings content.
          </p>
        </TabsPanel>
        <TabsPanel value="security">
          <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
            Security settings — restricted.
          </p>
        </TabsPanel>
      </TabsRoot>
    </div>
  ),
};

export const ManyTabs: Story = {
  name: "Many Tabs",
  render: () => (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <TabsRoot defaultValue="1">
        <TabsList>
          {["All", "Open", "Closed", "Draft", "Archived"].map((label, i) => (
            <TabsTrigger key={label} value={String(i + 1)}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {["All", "Open", "Closed", "Draft", "Archived"].map((label, i) => (
          <TabsPanel key={label} value={String(i + 1)}>
            <p style={{ margin: 0, fontSize: 13, color: "#78716c" }}>
              Showing {label.toLowerCase()} items.
            </p>
          </TabsPanel>
        ))}
      </TabsRoot>
    </div>
  ),
};
