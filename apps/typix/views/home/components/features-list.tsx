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
    items: [
      "Paragraph",
      "Headings (H1-H6)",
      "Blockquote",
      "Code Block",
    ],
  },
  {
    title: "Lists",
    items: [
      "Bullet List",
      "Numbered List",
      "Check List (Todo)",
    ],
  },
  {
    title: "Font Controls",
    items: [
      "Font Size (8-144px)",
      "Increment / Decrement",
    ],
  },
  {
    title: "History",
    items: [
      "Undo (Ctrl+Z)",
      "Redo (Ctrl+Y)",
    ],
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
    <div className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-lg font-semibold mb-4">Implemented Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {features.map((category) => (
          <div key={category.title}>
            <h3 className="text-sm font-medium mb-2 text-foreground">
              {category.title}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="text-xs text-muted-foreground flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-primary" />
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
