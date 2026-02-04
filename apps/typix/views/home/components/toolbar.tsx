"use client";

import { useTypixEditor, useActiveFormats } from "@typix-editor/react";
import { cn } from "@/lib/cn";

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-border mx-1" />
);

const ToolbarLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
    {children}
  </span>
);

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "format" | "block" | "list";
};

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
  variant = "default"
}: ToolbarButtonProps) => {
  const activeColors = {
    default: "bg-accent",
    format: "bg-primary text-primary-foreground",
    block: "bg-blue-500 text-white",
    list: "bg-green-500 text-white",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "px-2.5 py-1.5 text-xs font-medium rounded-md transition-all",
        "hover:bg-accent/80 active:scale-95",
        "border border-transparent",
        active ? activeColors[variant] : "bg-background hover:border-border"
      )}
    >
      {children}
    </button>
  );
};

export function Toolbar() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats();

  return (
    <div className="flex flex-col gap-3 p-4 border border-border rounded-lg bg-card shadow-sm">
      {/* Row 1: History & Text Formatting */}
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarLabel>History</ToolbarLabel>
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => editor.undo()} title="Undo (Ctrl+Z)">
            Undo
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.redo()} title="Redo (Ctrl+Y)">
            Redo
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <ToolbarLabel>Format</ToolbarLabel>
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.toggleBold()}
            active={isActive("bold")}
            title="Bold (Ctrl+B)"
            variant="format"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleItalic()}
            active={isActive("italic")}
            title="Italic (Ctrl+I)"
            variant="format"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleUnderline()}
            active={isActive("underline")}
            title="Underline (Ctrl+U)"
            variant="format"
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleStrikethrough()}
            active={isActive("strikethrough")}
            title="Strikethrough"
            variant="format"
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleCode()}
            active={isActive("code")}
            title="Inline Code"
            variant="format"
          >
            {"</>"}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleSubscript()}
            active={isActive("subscript")}
            title="Subscript"
            variant="format"
          >
            X<sub>2</sub>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleSuperscript()}
            active={isActive("superscript")}
            title="Superscript"
            variant="format"
          >
            X<sup>2</sup>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleHighlight()}
            active={isActive("highlight")}
            title="Highlight"
            variant="format"
          >
            <mark className="bg-yellow-200 px-0.5">H</mark>
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.clearFormatting()}
          title="Clear Formatting"
        >
          Clear
        </ToolbarButton>
      </div>

      {/* Row 2: Block Types */}
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarLabel>Blocks</ToolbarLabel>
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.setParagraph()}
            active={editor.isBlockActive("paragraph")}
            title="Paragraph"
            variant="block"
          >
            Paragraph
          </ToolbarButton>
          {([1, 2, 3, 4, 5, 6] as const).map((level) => (
            <ToolbarButton
              key={level}
              onClick={() => editor.toggleHeading({ level })}
              active={editor.isBlockActive(`h${level}`)}
              title={`Heading ${level}`}
              variant="block"
            >
              H{level}
            </ToolbarButton>
          ))}
        </div>

        <ToolbarDivider />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.toggleQuote()}
            active={editor.isBlockActive("quote")}
            title="Blockquote"
            variant="block"
          >
            Quote
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleCodeBlock()}
            active={editor.isBlockActive("code")}
            title="Code Block"
            variant="block"
          >
            Code
          </ToolbarButton>
        </div>
      </div>

      {/* Row 3: Lists & Font Size */}
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarLabel>Lists</ToolbarLabel>
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.toggleBulletList()}
            active={editor.isBlockActive("bullet")}
            title="Bullet List"
            variant="list"
          >
            Bullet
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleOrderedList()}
            active={editor.isBlockActive("number")}
            title="Numbered List"
            variant="list"
          >
            Numbered
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.toggleCheckList()}
            active={editor.isBlockActive("check")}
            title="Check List"
            variant="list"
          >
            Checklist
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <ToolbarLabel>Font Size</ToolbarLabel>
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.decrementFontSize(2)}
            title="Decrease Font Size"
          >
            A-
          </ToolbarButton>
          <span className="px-2 py-1 text-xs font-mono bg-muted rounded min-w-[45px] text-center">
            {editor.getFontSize()}px
          </span>
          <ToolbarButton
            onClick={() => editor.incrementFontSize(2)}
            title="Increase Font Size"
          >
            A+
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.focus()} title="Focus Editor">
          Focus
        </ToolbarButton>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 pt-2 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Block:</span>
          <span className="font-medium px-2 py-0.5 bg-muted rounded">
            {editor.getBlockType() || "none"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Editable:</span>
          <span className={cn(
            "font-medium px-2 py-0.5 rounded",
            editor.isEditable() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {editor.isEditable() ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
