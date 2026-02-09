"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EditorBubbleItem,
  EditorBubbleMenu,
  useActiveFormats,
  useTypixEditor,
} from "@typix-editor/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Highlighter,
} from "lucide-react";

type BubbleButtonProps = {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title: string;
};

const BubbleButton = ({
  isActive,
  children,
  onClick,
  title,
}: BubbleButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      "h-8 w-8 rounded-md transition-all hover:bg-accent/80",
      isActive && "bg-primary/15 text-primary hover:bg-primary/25 shadow-sm"
    )}
    onClick={onClick}
    title={title}
    type="button"
  >
    {children}
  </Button>
);

const Divider = () => <div className="mx-1 h-5 w-px bg-border/60" />;

export function BubbleMenu() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats();

  return (
    <EditorBubbleMenu className="flex items-center gap-0.5 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-sm p-1.5 shadow-xl ring-1 ring-black/5">
      <EditorBubbleItem name="bold">
        {() => (
          <BubbleButton
            isActive={isActive("bold")}
            onClick={() => editor?.toggleBold()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem name="italic">
        {() => (
          <BubbleButton
            isActive={isActive("italic")}
            onClick={() => editor?.toggleItalic()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem name="underline">
        {() => (
          <BubbleButton
            isActive={isActive("underline")}
            onClick={() => editor?.toggleUnderline()}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem name="strikethrough">
        {() => (
          <BubbleButton
            isActive={isActive("strikethrough")}
            onClick={() => editor?.toggleStrikethrough()}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <Divider />

      <EditorBubbleItem name="code">
        {() => (
          <BubbleButton
            isActive={isActive("code")}
            onClick={() => editor?.toggleCode()}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem name="highlight">
        {() => (
          <BubbleButton
            isActive={isActive("highlight")}
            onClick={() => editor?.toggleHighlight()}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </BubbleButton>
        )}
      </EditorBubbleItem>
    </EditorBubbleMenu>
  );
}
