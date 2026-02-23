"use client";

import {
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
  EditorContent,
  EditorRoot,
  useActiveFormats,
  useBlockType,
  useTypixEditor,
} from "@typix-editor/react";
import "@typix-editor/react/src/styles/main.css";
import {
  ContextMenuExtension,
  type TypixContextMenuItem,
} from "@typix-editor/extension-context-menu";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme: defaultTheme,
});

function Separator() {
  return <div className="mx-0.5 h-4 w-px bg-fd-border" />;
}

function Toolbar() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats({
    formats: ["bold", "italic", "underline", "strikethrough", "code"],
  });
  const blockType = useBlockType();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-fd-border border-b px-2 py-1.5">
      <Button
        onClick={() => editor.undo()}
        size="icon-sm"
        title="Undo"
        variant="ghost"
      >
        <Undo />
      </Button>
      <Button
        onClick={() => editor.redo()}
        size="icon-sm"
        title="Redo"
        variant="ghost"
      >
        <Redo />
      </Button>
      <Separator />
      <Button
        onClick={() => editor.toggleBold()}
        size="icon-sm"
        variant={isActive("bold") ? "secondary" : "ghost"}
      >
        <Bold />
      </Button>
      <Button
        onClick={() => editor.toggleItalic()}
        size="icon-sm"
        variant={isActive("italic") ? "secondary" : "ghost"}
      >
        <Italic />
      </Button>
      <Button
        onClick={() => editor.toggleUnderline()}
        size="icon-sm"
        variant={isActive("underline") ? "secondary" : "ghost"}
      >
        <Underline />
      </Button>
      <Button
        onClick={() => editor.toggleStrikethrough()}
        size="icon-sm"
        variant={isActive("strikethrough") ? "secondary" : "ghost"}
      >
        <Strikethrough />
      </Button>
      <Button
        onClick={() => editor.toggleCode()}
        size="icon-sm"
        variant={isActive("code") ? "secondary" : "ghost"}
      >
        <Code />
      </Button>
      <Separator />
      <Button
        onClick={() => editor.toggleHeading({ level: 1 })}
        size="icon-sm"
        variant={blockType === "h1" ? "secondary" : "ghost"}
      >
        <Heading1 />
      </Button>
      <Button
        onClick={() => editor.toggleHeading({ level: 2 })}
        size="icon-sm"
        variant={blockType === "h2" ? "secondary" : "ghost"}
      >
        <Heading2 />
      </Button>
      <Button
        onClick={() => editor.toggleQuote()}
        size="icon-sm"
        variant={blockType === "quote" ? "secondary" : "ghost"}
      >
        <Quote />
      </Button>
      <Button
        onClick={() => editor.toggleBulletList()}
        size="icon-sm"
        variant={blockType === "bullet" ? "secondary" : "ghost"}
      >
        <List />
      </Button>
      <Button
        onClick={() => editor.toggleOrderedList()}
        size="icon-sm"
        variant={blockType === "number" ? "secondary" : "ghost"}
      >
        <ListOrdered />
      </Button>
    </div>
  );
}

// Keep options inside the component so `disabled` stays in sync with editor state.
function EditorWithContextMenu() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats({
    formats: ["bold", "italic", "underline", "strikethrough", "code"],
  });
  const blockType = useBlockType();

  const options: TypixContextMenuItem[] = [
    {
      type: "item",
      label: "Bold",
      icon: <Bold size={14} />,
      disabled: isActive("bold"),
      onSelect: (ed) => ed.toggleBold(),
    },
    {
      type: "item",
      label: "Italic",
      icon: <Italic size={14} />,
      disabled: isActive("italic"),
      onSelect: (ed) => ed.toggleItalic(),
    },
    {
      type: "item",
      label: "Underline",
      icon: <Underline size={14} />,
      disabled: isActive("underline"),
      onSelect: (ed) => ed.toggleUnderline(),
    },
    {
      type: "item",
      label: "Strikethrough",
      icon: <Strikethrough size={14} />,
      disabled: isActive("strikethrough"),
      onSelect: (ed) => ed.toggleStrikethrough(),
    },
    {
      type: "item",
      label: "Inline Code",
      icon: <Code size={14} />,
      disabled: isActive("code"),
      onSelect: (ed) => ed.toggleCode(),
    },
    { type: "separator" },
    {
      type: "item",
      label: "Heading 1",
      icon: <Heading1 size={14} />,
      disabled: blockType === "h1",
      onSelect: (ed) => ed.toggleHeading({ level: 1 }),
    },
    {
      type: "item",
      label: "Heading 2",
      icon: <Heading2 size={14} />,
      disabled: blockType === "h2",
      onSelect: (ed) => ed.toggleHeading({ level: 2 }),
    },
    {
      type: "item",
      label: "Quote",
      icon: <Quote size={14} />,
      disabled: blockType === "quote",
      onSelect: (ed) => ed.toggleQuote(),
    },
    { type: "separator" },
    {
      type: "item",
      label: "Undo",
      icon: <Undo size={14} />,
      onSelect: (ed) => ed.undo(),
    },
    {
      type: "item",
      label: "Redo",
      icon: <Redo size={14} />,
      onSelect: (ed) => ed.redo(),
    },
  ];

  return <ContextMenuExtension options={options} />;
}

export default function ContextMenuExample() {
  return (
    <EditorRoot config={config}>
      <div className="w-full overflow-hidden rounded-t-md border border-fd-border bg-background">
        <Toolbar />
        <EditorContent
          className="max-h-[300px] min-h-[120px] overflow-y-auto text-sm"
          placeholder="Right-click to see the context menu..."
        />
      </div>
      <EditorWithContextMenu />
    </EditorRoot>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import {
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
  EditorContent,
  EditorRoot,
  useActiveFormats,
  useBlockType,
  useTypixEditor,
} from "@typix-editor/react";
import {
  ContextMenuExtension,
  type TypixContextMenuItem,
} from "@typix-editor/extension-context-menu";
import {
  Bold, Italic, Underline, Code,
  Heading1, Heading2, Quote, Undo, Redo,
} from "lucide-react";
import { Toolbar } from "./Toolbar";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme: defaultTheme,
});

// Options live inside the component so \`disabled\` reflects current state.
function EditorWithContextMenu() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats({
    formats: ["bold", "italic", "underline", "code"],
  });
  const blockType = useBlockType();

  const options: TypixContextMenuItem[] = [
    {
      type: "item",
      label: "Bold",
      icon: <Bold size={14} />,
      disabled: isActive("bold"),
      onSelect: (ed) => ed.toggleBold(),
    },
    {
      type: "item",
      label: "Italic",
      icon: <Italic size={14} />,
      disabled: isActive("italic"),
      onSelect: (ed) => ed.toggleItalic(),
    },
    {
      type: "item",
      label: "Inline Code",
      icon: <Code size={14} />,
      disabled: isActive("code"),
      onSelect: (ed) => ed.toggleCode(),
    },
    { type: "separator" },
    {
      type: "item",
      label: "Heading 1",
      icon: <Heading1 size={14} />,
      disabled: blockType === "h1",
      onSelect: (ed) => ed.toggleHeading({ level: 1 }),
    },
    {
      type: "item",
      label: "Quote",
      icon: <Quote size={14} />,
      disabled: blockType === "quote",
      onSelect: (ed) => ed.toggleQuote(),
    },
    { type: "separator" },
    {
      type: "item",
      label: "Undo",
      icon: <Undo size={14} />,
      onSelect: (ed) => ed.undo(),
    },
    {
      type: "item",
      label: "Redo",
      icon: <Redo size={14} />,
      onSelect: (ed) => ed.redo(),
    },
  ];

  return <ContextMenuExtension options={options} />;
}

export default function ContextMenuExample() {
  return (
    <EditorRoot config={config}>
      <div className="editor-container">
        <Toolbar />
        <EditorContent placeholder="Right-click to see the context menu..." />
      </div>
      <EditorWithContextMenu />
    </EditorRoot>
  );
}`,
  },
  {
    name: "Toolbar.tsx",
    lang: "tsx",
    code: `import { useTypixEditor, useActiveFormats, useBlockType } from "@typix-editor/react";
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Quote, List, ListOrdered,
  Undo, Redo,
} from "lucide-react";
import { ToolbarButton } from "./Button";

export function Toolbar() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats({
    formats: ["bold", "italic", "underline", "strikethrough", "code"],
  });
  const blockType = useBlockType();

  return (
    <div className="toolbar">
      <ToolbarButton onClick={() => editor.undo()} title="Undo"><Undo /></ToolbarButton>
      <ToolbarButton onClick={() => editor.redo()} title="Redo"><Redo /></ToolbarButton>
      <div className="toolbar-sep" />
      <ToolbarButton onClick={() => editor.toggleBold()} active={isActive("bold")}><Bold /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleItalic()} active={isActive("italic")}><Italic /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleUnderline()} active={isActive("underline")}><Underline /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleStrikethrough()} active={isActive("strikethrough")}><Strikethrough /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleCode()} active={isActive("code")}><Code /></ToolbarButton>
      <div className="toolbar-sep" />
      <ToolbarButton onClick={() => editor.toggleHeading({ level: 1 })} active={blockType === "h1"}><Heading1 /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleHeading({ level: 2 })} active={blockType === "h2"}><Heading2 /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleQuote()} active={blockType === "quote"}><Quote /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleBulletList()} active={blockType === "bullet"}><List /></ToolbarButton>
      <ToolbarButton onClick={() => editor.toggleOrderedList()} active={blockType === "number"}><ListOrdered /></ToolbarButton>
    </div>
  );
}`,
  },
  {
    name: "Button.tsx",
    lang: "tsx",
    code: `import type { ButtonHTMLAttributes } from "react";

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function ToolbarButton({
  active,
  className = "toolbar-btn",
  children,
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}`,
  },
  {
    name: "main.css",
    lang: "css",
    code: `.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  border-bottom: 1px solid #e5e7eb;
  padding: 6px 8px;
}

.toolbar-sep {
  width: 1px;
  height: 16px;
  background: #e5e7eb;
  margin: 0 2px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  color: inherit;
  transition: background-color 100ms;
}

.toolbar-btn:hover {
  background: rgba(0, 0, 0, 0.07);
}

.toolbar-btn[data-active] {
  background: rgba(0, 0, 0, 0.1);
}`,
  },
];
