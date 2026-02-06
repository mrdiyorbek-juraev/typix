"use client";

const features = [
  {
    title: "Text Formatting",
    items: [
      "Bold (Ctrl+B)",
      "Italic (Ctrl+I)",
      "Underline (Ctrl+U)",
      "Strikethrough",
      "Inline Code",
      "Subscript / Superscript",
      "Highlight",
      "Clear Formatting",
    ],
  },
  {
    title: "Block Types",
    items: ["Paragraph", "Headings (H1-H6)", "Blockquote", "Code Block"],
  },
  {
    title: "Lists",
    items: ["Bullet List", "Numbered List", "Check List (Todo)"],
  },
  {
    title: "Font Controls",
    items: ["Font Size (8-144px)", "Increment / Decrement"],
  },
  {
    title: "History",
    items: ["Undo (Ctrl+Z)", "Redo (Ctrl+Y)"],
  },
  {
    title: "Extensions",
    items: [
      "Auto Link Detection",
      "@ Mentions",
      "/ Slash Commands",
      "Keywords Highlight",
      "Max Length Limit",
      "Draggable Blocks",
      "Context Menu",
      "Autocomplete",
      "Keyboard Shortcuts",
    ],
  },
];

export function FeaturesList() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 font-semibold text-lg">Implemented Features</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {features.map((category) => (
          <div key={category.title}>
            <h3 className="mb-2 font-medium text-foreground text-sm">
              {category.title}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li
                  className="flex items-center gap-1.5 text-muted-foreground text-xs"
                  key={item}
                >
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
