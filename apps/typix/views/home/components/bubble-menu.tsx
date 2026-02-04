"use client";

import {
  EditorBubbleItem,
  EditorBubbleMenu,
  FORMAT_TEXT_COMMAND,
} from "@typix-editor/react";
import { cn } from "@/lib/cn";

type BubbleButtonProps = {
  isActive: boolean;
  children: React.ReactNode;
};

const BubbleButton = ({ isActive, children }: BubbleButtonProps) => (
  <button
    className={cn(
      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "hover:bg-accent"
    )}
  >
    {children}
  </button>
);

export function BubbleMenu() {
  return (
    <EditorBubbleMenu className="flex items-center gap-1 p-1 bg-popover border border-border rounded-lg shadow-lg">
      <EditorBubbleItem
        name="bold"
        onSelect={(editor) => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        {({ isActive }) => (
          <BubbleButton isActive={isActive}>
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
          <BubbleButton isActive={isActive}>
            {"</>"}
          </BubbleButton>
        )}
      </EditorBubbleItem>
    </EditorBubbleMenu>
  );
}
