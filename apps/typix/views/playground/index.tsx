"use client";

import {
  createEditorConfig,
  defaultTheme,
  EditorContent,
  EditorRoot,
  useEditor,
} from "@typix-editor/react";
import Link from "next/link";
import { useState } from "react";

import {
  BubbleMenu,
  CommandMenu,
  EditorExtensions,
  FeaturesList,
  Toolbar,
} from "./components";
import { extensionNodes, initialValue, slashCommands } from "./constants";

// Debug component to test useEditor hook
const EditorDebug = () => {
  const { isEmpty } = useEditor();
  return (
    <div className="absolute top-2 right-2 rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
      {isEmpty ? "Empty" : "Has content"}
    </div>
  );
};

export default function PlayGroundPage() {
  const [editorState, setEditorState] = useState<any>(initialValue);

  const config = createEditorConfig({
    namespace: "typix-editor",
    extension_nodes: extensionNodes,
    editable: true,
    editorState: null,
    initialState: initialValue,
    theme: defaultTheme,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6 px-4 py-8">
      {/* Header */}
      <header className="space-y-2 text-center">
        <h1 className="font-bold text-3xl tracking-tight">Typix Editor</h1>
        <p className="text-muted-foreground">
          A modern, extensible rich-text editor built on Lexical.{" "}
          <Link
            className="text-primary underline underline-offset-4"
            href="/docs"
          >
            View Documentation
          </Link>
        </p>
      </header>

      {/* Editor */}
      <EditorRoot
        config={config}
        content={editorState}
        onContentChange={setEditorState}
      >
        {/* Toolbar */}
        <Toolbar />

        {/* Editor Content Area */}
        <div className="relative mt-4">
          <EditorContent
            className="min-h-[400px] rounded-lg border border-border bg-background p-4"
            placeholder="Start typing... Use / for commands, @ for mentions"
          >
            {/* Bubble Menu - appears on text selection */}
            <BubbleMenu />

            {/* Slash Commands */}
            <CommandMenu commands={slashCommands} />

            {/* All Extensions */}
            <EditorExtensions />

            {/* Debug Info */}
            <EditorDebug />
          </EditorContent>
        </div>
      </EditorRoot>

      {/* Features List */}
      <FeaturesList />

      {/* Tips & Shortcuts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="mb-3 font-medium">Quick Tips</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              Type{" "}
              <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
                /
              </kbd>{" "}
              to open the command menu
            </li>
            <li>
              Type{" "}
              <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
                @
              </kbd>{" "}
              to mention someone
            </li>
            <li>Select text to see the bubble menu</li>
            <li>Right-click for context menu options</li>
            <li>Drag blocks using the handle on the left</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="mb-3 font-medium">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground text-sm">
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+B
              </kbd>{" "}
              Bold
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+I
              </kbd>{" "}
              Italic
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+U
              </kbd>{" "}
              Underline
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+K
              </kbd>{" "}
              Insert Link
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Z
              </kbd>{" "}
              Undo
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Y
              </kbd>{" "}
              Redo
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Alt+0
              </kbd>{" "}
              Paragraph
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Alt+1-3
              </kbd>{" "}
              Heading
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Shift+7
              </kbd>{" "}
              Numbered List
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Shift+8
              </kbd>{" "}
              Bullet List
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+Shift+9
              </kbd>{" "}
              Check List
            </div>
            <div>
              <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">
                Ctrl+\
              </kbd>{" "}
              Clear Format
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
