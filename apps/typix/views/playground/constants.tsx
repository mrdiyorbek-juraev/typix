import { AutocompleteNode } from "@typix-editor/extension-auto-complete";
import { KeywordNode } from "@typix-editor/extension-keywords";
import { MentionNode } from "@typix-editor/extension-mention";
import { createCommand, defaultExtensionNodes } from "@typix-editor/react";
import {
  $createHeadingNode,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $setBlocksType,
} from "@typix-editor/react/lexical";

// Initial editor state
export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Welcome to Typix Editor!",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Try clicking on this ",
            type: "text",
            version: 1,
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "example link",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "link",
            version: 1,
            rel: "noopener noreferrer",
            target: "_blank",
            title: "",
            url: "https://typix.dev",
          },
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: " to see the floating link editor. Use ",
            type: "text",
            version: 1,
          },
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Ctrl+K",
            type: "text",
            version: 1,
          },
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: " to insert a new link.",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as any;

// Extension nodes
export const extensionNodes = [
  ...defaultExtensionNodes,
  AutocompleteNode,
  KeywordNode,
  MentionNode,
];

// Slash commands
export const ParagraphCommand = createCommand({
  title: "Text",
  icon: <div className="text-lg">¶</div>,
  keywords: ["text", "p", "paragraph"],
  description: "Plain text paragraph",
  onSelect: (_, editor) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  },
});

export const Heading1Command = createCommand({
  title: "Heading 1",
  icon: <div className="font-bold">H1</div>,
  keywords: ["heading", "header", "h1"],
  description: "Large section heading",
  onSelect: (_, editor) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1"));
      }
    }),
});

export const Heading2Command = createCommand({
  title: "Heading 2",
  icon: <div className="font-bold">H2</div>,
  keywords: ["heading", "header", "h2"],
  description: "Medium section heading",
  onSelect: (_, editor) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h2"));
      }
    }),
});

export const Heading3Command = createCommand({
  title: "Heading 3",
  icon: <div className="font-bold">H3</div>,
  keywords: ["heading", "header", "h3"],
  description: "Small section heading",
  onSelect: (_, editor) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h3"));
      }
    }),
});

export const slashCommands = [
  ParagraphCommand,
  Heading1Command,
  Heading2Command,
  Heading3Command,
];

// Mock users for mentions
export const mockUsers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Williams" },
  { id: "5", name: "Charlie Brown" },
];
