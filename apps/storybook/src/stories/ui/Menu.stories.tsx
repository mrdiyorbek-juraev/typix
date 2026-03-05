import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Menu, MenuItem, MenuSeparator, MenuGroup, MenuLabel } from "@typix-editor/ui";

const meta: Meta<typeof Menu> = {
  title: "UI/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Static menu container with items, labels, separators, and groups. Use DropdownMenu for floating menus.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu style={{ width: 220 }}>
      <MenuLabel>File</MenuLabel>
      <MenuGroup>
        <MenuItem>New File</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem>Save</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuLabel>Edit</MenuLabel>
      <MenuGroup>
        <MenuItem>Undo</MenuItem>
        <MenuItem>Redo</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuItem disabled>Disabled Item</MenuItem>
    </Menu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menu style={{ width: 220 }}>
      <MenuItem>
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M3.5 2a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-7L8.5 2h-5z" stroke="currentColor" /></svg>
        New File
      </MenuItem>
      <MenuItem>
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M2.5 2v11h10V5.5L9 2H2.5z" stroke="currentColor" /></svg>
        Open
      </MenuItem>
      <MenuSeparator />
      <MenuItem disabled>
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M5 7.5h5M7.5 5v5" stroke="currentColor" /></svg>
        Disabled
      </MenuItem>
    </Menu>
  ),
};

export const Compact: Story = {
  render: () => (
    <Menu style={{ width: 180 }}>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </Menu>
  ),
};
