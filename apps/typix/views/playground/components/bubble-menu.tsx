"use client";

import {
  EditorBubbleItem,
  EditorBubbleMenu,
  useActiveFormats,
  useTypixEditor,
} from "@typix-editor/react";
import { cn } from "@/lib/cn";
import { FORMAT_TEXT_COMMAND } from "@typix-editor/react/lexical";

type BubbleButtonProps = {
  isActive: boolean;
  children: React.ReactNode;
};

const BubbleButton = ({ isActive, children }: BubbleButtonProps) => (
  <button
    className={cn(
      "rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
      isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
    )}
  >
    {children}
  </button>
);

export function BubbleMenu() {
  const editor = useTypixEditor();
  const { isActive } = useActiveFormats();
  return (
    <EditorBubbleMenu className="flex items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg">
      <EditorBubbleItem
        name="bold"
        onSelect={() => {
          editor?.toggleBold();
        }}
      >
        {({}) => (
          <BubbleButton isActive={isActive("bold")}>
            <strong>B</strong>
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem
        name="italic"
        onSelect={(editor) => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        {({ isActive }) => (
          <BubbleButton isActive={isActive}>
            <em>I</em>
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem
        name="underline"
        onSelect={(editor) => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        {({ isActive }) => (
          <BubbleButton isActive={isActive}>
            <u>U</u>
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem
        name="strikethrough"
        onSelect={(editor) => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      >
        {({ isActive }) => (
          <BubbleButton isActive={isActive}>
            <s>S</s>
          </BubbleButton>
        )}
      </EditorBubbleItem>

      <EditorBubbleItem
        name="code"
        onSelect={(editor) => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
      >
        {({ isActive }) => (
          <BubbleButton isActive={isActive}>{"</>"}</BubbleButton>
        )}
      </EditorBubbleItem>
    </EditorBubbleMenu>
  );
}
