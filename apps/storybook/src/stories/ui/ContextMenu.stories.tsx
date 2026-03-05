import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
  Kbd,
} from "@typix-editor/ui";

const meta: Meta = {
  title: "UI/ContextMenu",
  parameters: { layout: "centered" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 120,
            border: "2px dashed var(--border)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--muted-foreground)",
            userSelect: "none",
            cursor: "context-menu",
          }}
        >
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>
            <Kbd>⌘[</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward
          <ContextMenuShortcut>
            <Kbd>⌘]</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>
            <Kbd>⌘R</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              Save page as…
              <ContextMenuShortcut>
                <Kbd>⇧⌘S</Kbd>
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create shortcut…</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem defaultChecked={false}>
          Show bookmarks bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem defaultChecked>
          Show full URLs
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const FileExplorer: StoryObj = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            width: 320,
            padding: 12,
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--card)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              borderRadius: 4,
              background: "var(--accent)",
            }}
          >
            <span>📄</span>
            <span style={{ fontSize: 13, color: "var(--foreground)" }}>
              README.md
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Open with…</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>
            <Kbd>⌘C</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Rename
          <ContextMenuShortcut>
            <Kbd>↵</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive focus:text-destructive">
          Move to trash
          <ContextMenuShortcut>
            <Kbd>⌫</Kbd>
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
