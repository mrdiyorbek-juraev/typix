import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Calendar, Button, Popover, PopoverTrigger, PopoverContent } from "@typix-editor/ui"

const meta: Meta = {
  title: "UI/Calendar",
  parameters: { layout: "centered" },
}
export default meta

export const Default: StoryObj = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, display: "inline-block" }}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </div>
    )
  },
}

export const RangePicker: StoryObj = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
          {range?.from
            ? range.to
              ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
              : range.from.toLocaleDateString()
            : "Pick a date range"}
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, display: "inline-block" }}>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
          />
        </div>
      </div>
    )
  },
}

export const InPopover: StoryObj = {
  name: "Date picker in popover",
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: 40 }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" style={{ minWidth: 200, justifyContent: "flex-start" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ opacity: 0.5 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {date ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => { setDate(d); setOpen(false) }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  },
}

export const MultipleMonths: StoryObj = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, display: "inline-block" }}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </div>
    )
  },
}
