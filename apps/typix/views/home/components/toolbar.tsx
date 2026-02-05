"use client";

import { useSpeechToText } from "@typix-editor/extension-speech-to-text";
import { useActiveFormats, useTypixEditor } from "@typix-editor/react";
import { cn } from "@/lib/cn";

const ToolbarDivider = () => <div className="mx-1 h-6 w-px bg-border" />;

const ToolbarLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
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
  variant = "default",
}: ToolbarButtonProps) => {
  const activeColors = {
    default: "bg-accent",
    format: "bg-primary text-primary-foreground",
    block: "bg-blue-500 text-white",
    list: "bg-green-500 text-white",
  };

  return (
    <button
      className={cn(
        "rounded-md px-2.5 py-1.5 font-medium text-xs transition-all",
        "hover:bg-accent/80 active:scale-95",
        "border border-transparent",
        active ? activeColors[variant] : "bg-background hover:border-border"
      )}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
};

export function Toolbar() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats();
  const { isListening, isSupported, toggle } = useSpeechToText();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
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
            active={isActive("bold")}
            onClick={() => editor.toggleBold()}
            title="Bold (Ctrl+B)"
            variant="format"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            active={isActive("italic")}
            onClick={() => editor.toggleItalic()}
            title="Italic (Ctrl+I)"
            variant="format"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            active={isActive("underline")}
            onClick={() => editor.toggleUnderline()}
            title="Underline (Ctrl+U)"
            variant="format"
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            active={isActive("strikethrough")}
            onClick={() => editor.toggleStrikethrough()}
            title="Strikethrough"
            variant="format"
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton
            active={isActive("code")}
            onClick={() => editor.toggleCode()}
            title="Inline Code"
            variant="format"
          >
            {"</>"}
          </ToolbarButton>
          <ToolbarButton
            active={isActive("subscript")}
            onClick={() => editor.toggleSubscript()}
            title="Subscript"
            variant="format"
          >
            X<sub>2</sub>
          </ToolbarButton>
          <ToolbarButton
            active={isActive("superscript")}
            onClick={() => editor.toggleSuperscript()}
            title="Superscript"
            variant="format"
          >
            X<sup>2</sup>
          </ToolbarButton>
          <ToolbarButton
            active={isActive("highlight")}
            onClick={() => editor.toggleHighlight()}
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
            active={editor.isBlockActive("paragraph")}
            onClick={() => editor.setParagraph()}
            title="Paragraph"
            variant="block"
          >
            Paragraph
          </ToolbarButton>
          {([1, 2, 3, 4, 5, 6] as const).map((level) => (
            <ToolbarButton
              active={editor.isBlockActive(`h${level}`)}
              key={level}
              onClick={() => editor.toggleHeading({ level })}
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
            active={editor.isBlockActive("quote")}
            onClick={() => editor.toggleQuote()}
            title="Blockquote"
            variant="block"
          >
            Quote
          </ToolbarButton>
          <ToolbarButton
            active={editor.isBlockActive("code")}
            onClick={() => editor.toggleCodeBlock()}
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
            active={editor.isBlockActive("bullet")}
            onClick={() => editor.toggleBulletList()}
            title="Bullet List"
            variant="list"
          >
            Bullet
          </ToolbarButton>
          <ToolbarButton
            active={editor.isBlockActive("number")}
            onClick={() => editor.toggleOrderedList()}
            title="Numbered List"
            variant="list"
          >
            Numbered
          </ToolbarButton>
          <ToolbarButton
            active={editor.isBlockActive("check")}
            onClick={() => editor.toggleCheckList()}
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
          <span className="min-w-[45px] rounded bg-muted px-2 py-1 text-center font-mono text-xs">
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

        {isSupported && (
          <>
            <ToolbarDivider />
            <ToolbarLabel>Voice</ToolbarLabel>
            <button
              className={cn(
                "rounded-md px-2.5 py-1.5 font-medium text-xs transition-all",
                "hover:bg-accent/80 active:scale-95",
                "flex items-center gap-1.5 border border-transparent",
                isListening
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-background hover:border-border"
              )}
              onClick={toggle}
              title={isListening ? "Stop listening" : "Start speech-to-text"}
              type="button"
            >
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              {isListening ? "Stop" : "Mic"}
            </button>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 border-border border-t pt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Block:</span>
          <span className="rounded bg-muted px-2 py-0.5 font-medium">
            {editor.getBlockType() || "none"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Editable:</span>
          <span
            className={cn(
              "rounded px-2 py-0.5 font-medium",
              editor.isEditable()
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {editor.isEditable() ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
