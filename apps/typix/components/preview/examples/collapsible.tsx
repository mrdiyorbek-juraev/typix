"use client";

import {
  configExtension,
  defaultExtensionNodes,
  defineExtension,
  EditorContent,
  EditorRoot,
  useActiveFormats,
  useBlockType,
  useTypixEditor,
} from "@typix-editor/react";
import { TailwindExtension } from "@lexical/tailwind";
import {
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleExtension,
  CollapsibleTitleNode,
  INSERT_COLLAPSIBLE_COMMAND,
} from "@typix-editor/extension-collapsible";
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

const extension = defineExtension({
  name: "typix/collapsible",
  namespace: "typix-editor",
  nodes: [
    ...defaultExtensionNodes,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
  ],
  dependencies: [
    TailwindExtension,
    configExtension(CollapsibleExtension, { disabled: false }),
  ],
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
      <Separator />
      <Button
        size="sm"
        variant="ghost"
        className="text-xs"
        onClick={() =>
          editor.lexical.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
        }
      >
        + Collapsible
      </Button>
    </div>
  );
}

export default function CollapsibleExample() {
  return (
    <EditorRoot extension={extension}>
      <div className="w-full overflow-hidden rounded-t-md border border-fd-border bg-background">
        <Toolbar />
        <EditorContent
          className="max-h-[300px] min-h-[120px] overflow-y-auto text-sm"
          placeholder="Start typing or insert a collapsible block..."
        />
      </div>
    </EditorRoot>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import {
  defaultExtensionNodes,
  EditorContent,
  EditorRoot,
  useTypixEditor,
} from "@typix-editor/react";
import { defineExtension } from "lexical";
import { TailwindExtension } from "@lexical/tailwind";
import {
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsiblePlugin,
  CollapsibleTitleNode,
  INSERT_COLLAPSIBLE_COMMAND,
} from "@typix-editor/extension-collapsible";
import { Toolbar } from "./Toolbar";

const extension = defineExtension({
  name: "typix/collapsible",
  namespace: "typix-editor",
  nodes: [
    ...defaultExtensionNodes,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
  ],
  dependencies: [TailwindExtension],
});

function InsertCollapsibleButton() {
  const editor = useTypixEditor();
  return (
    <button
      className="toolbar-btn"
      style={{ width: "auto", padding: "0 8px", fontSize: 12 }}
      onClick={() =>
        editor.lexical.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
      }
    >
      + Collapsible
    </button>
  );
}

export default function CollapsibleExample() {
  return (
    <EditorRoot extension={extension}>
      <div className="editor-container">
        <Toolbar extra={<InsertCollapsibleButton />} />
        <EditorContent placeholder="Start typing or insert a collapsible block..." />
      </div>
      <CollapsiblePlugin />
    </EditorRoot>
  );
}`,
  },
  {
    name: "Toolbar.tsx",
    lang: "tsx",
    code: `import type { ReactNode } from "react";
import { useTypixEditor, useActiveFormats, useBlockType } from "@typix-editor/react";
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Quote, List, ListOrdered,
  Undo, Redo,
} from "lucide-react";
import { ToolbarButton } from "./Button";

export function Toolbar({ extra }: { extra?: ReactNode }) {
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
      {extra}
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
