"use client";

import { useCallback, useRef } from "react";
import { ImagePlus, Moon, Sun, Table } from "lucide-react";
import { useTheme } from "next-themes";
import { useTypixEditor } from "@typix-editor/react";
import { INSERT_IMAGE_COMMAND } from "@typix-editor/extension-image";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
  // History
  UndoRedoButton,
  // Typography
  FontFamilyDropdownMenu,
  FontSizeInput,
  // Block types
  HeadingButton,
  BlockquoteButton,
  CodeBlockButton,
  // Lists
  ListDropdownMenu,
  // Text marks
  MarkButton,
  // Colors
  ColorTextButton,
  ColorHighlightButton,
  ClearFormattingButton,
  // Alignment
  TextAlignButton,
  // Speech
  SpeechToTextButton,
  // Tooltip
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@typix-editor/ui";

export function EditorToolbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const editor = useTypixEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor.lexical.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: reader.result,
            altText: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [editor]
  );

  return (
    <Toolbar className="w-full flex-wrap border-b px-2 py-1">
      {/* Undo / Redo */}
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Typography */}
      <ToolbarGroup>
        <FontFamilyDropdownMenu />
        <FontSizeInput />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Block types */}
      <ToolbarGroup>
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <HeadingButton level={3} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Lists */}
      <ToolbarGroup>
        <ListDropdownMenu />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Text marks */}
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Colors & formatting */}
      <ToolbarGroup>
        <ColorTextButton />
        <ColorHighlightButton />
        <ClearFormattingButton />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Alignment */}
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator className="mx-1 h-5 w-px" />

      {/* Insert table */}
      <ToolbarGroup>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton
                aria-label="Insert table"
                onClick={() =>
                  editor.chain().insertTable({ rows: 3, columns: 3, includeHeaders: true }).run()
                }
              >
                <Table />
              </ToolbarButton>
            </TooltipTrigger>
            <TooltipContent>Insert Table</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ToolbarGroup>

      {/* Insert image */}
      <ToolbarGroup>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton
                aria-label="Insert image"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus />
              </ToolbarButton>
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </ToolbarGroup>

      <ToolbarSpacer />

      {/* Right: speech + theme */}
      <ToolbarGroup>
        <SpeechToTextButton hideWhenUnsupported />
        <ToolbarButton
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  );
}
