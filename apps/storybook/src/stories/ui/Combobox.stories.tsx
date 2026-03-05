import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@typix-editor/ui";

const FRUITS = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
];

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Searchable combobox built on Base UI. Handles filtering internally via the `items` prop. Use `ComboboxList` with a render function for item rendering.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div style={{ padding: 80, maxWidth: 300 }}>
        <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>
          Selected: {value || "none"}
        </p>
        <Combobox items={FRUITS} onValueChange={(v) => setValue(v as string)}>
          <ComboboxInput placeholder="Search fruits..." />
          <ComboboxContent>
            <ComboboxList>
              {(fruit: string) => (
                <ComboboxItem key={fruit} value={fruit}>
                  {fruit}
                </ComboboxItem>
              )}
            </ComboboxList>
            <ComboboxEmpty>No results found</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};

export const InsideOverflow: Story = {
  name: "Inside Overflow Container",
  render: () => (
    <div
      style={{
        padding: 40,
        overflow: "hidden",
        border: "1px dashed #d4d4d8",
        borderRadius: 8,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Combobox items={FRUITS}>
        <ComboboxInput placeholder="Search..." inputSize="sm" style={{ width: 200 }} />
        <ComboboxContent>
          <ComboboxList>
            {(fruit: string) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};
