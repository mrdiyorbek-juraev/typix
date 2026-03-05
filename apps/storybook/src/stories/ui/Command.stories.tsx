import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
  Popover, PopoverTrigger, PopoverContent, Button,
} from "@typix-editor/ui"

const meta: Meta = {
  title: "UI/Command",
  parameters: { layout: "centered" },
}
export default meta

const suggestions = {
  "Suggestions": [
    { label: "Calendar",      icon: "📅", shortcut: "⌘C" },
    { label: "Search emoji",  icon: "😀", shortcut: "⌘E" },
    { label: "Calculator",    icon: "🧮", shortcut: "" },
  ],
  "Settings": [
    { label: "Profile",       icon: "👤", shortcut: "⌘P" },
    { label: "Billing",       icon: "💳", shortcut: "" },
    { label: "Settings",      icon: "⚙️",  shortcut: "⌘," },
    { label: "Keyboard shortcuts", icon: "⌨️", shortcut: "" },
  ],
}

export const Default: StoryObj = {
  render: () => (
    <Command style={{ width: 360, border: "1px solid var(--border)", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(suggestions).map(([group, items], i) => (
          <React.Fragment key={group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map(({ label, icon, shortcut }) => (
                <CommandItem key={label}>
                  <span>{icon}</span>
                  {label}
                  {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </Command>
  ),
}

export const InPopover: StoryObj = {
  name: "Command palette in popover",
  render: () => (
    <div style={{ padding: 80 }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search…
            <span style={{ marginLeft: 8, opacity: 0.5, fontSize: 11 }}>⌘K</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80">
          <Command>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {Object.entries(suggestions).map(([group, items]) => (
                <CommandGroup key={group} heading={group}>
                  {items.map(({ label, icon, shortcut }) => (
                    <CommandItem key={label}>
                      <span>{icon}</span>
                      {label}
                      {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
