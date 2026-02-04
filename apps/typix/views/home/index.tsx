"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createEditorConfig,
  defaultTheme,
  EditorContent,
  EditorRoot,
  useEditor,
} from "@typix-editor/react";

import {
  Toolbar,
  BubbleMenu,
  CommandMenu,
  EditorExtensions,
  FeaturesList,
} from "./components";
import { initialValue, extensionNodes, slashCommands } from "./constants";

// Debug component to test useEditor hook
const EditorDebug = () => {
  const { isEmpty } = useEditor();
  return (
    <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground">
      {isEmpty ? "Empty" : "Has content"}
    </div>
  );
};

export default function HomePage() {
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
    <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Typix Editor</h1>
        <p className="text-muted-foreground">
          A modern, extensible rich-text editor built on Lexical.{" "}
          <Link href="/docs" className="text-primary underline underline-offset-4">
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
            placeholder="Start typing... Use / for commands, @ for mentions"
            className="min-h-[400px] p-4 border border-border rounded-lg bg-background"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Quick Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>Type <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono text-xs">/</kbd> to open the command menu</li>
            <li>Type <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono text-xs">@</kbd> to mention someone</li>
            <li>Select text to see the bubble menu</li>
            <li>Right-click for context menu options</li>
            <li>Drag blocks using the handle on the left</li>
          </ul>
        </div>

        <div className="p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+B</kbd> Bold</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+I</kbd> Italic</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+U</kbd> Underline</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+K</kbd> Insert Link</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Z</kbd> Undo</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Y</kbd> Redo</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Alt+0</kbd> Paragraph</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Alt+1-3</kbd> Heading</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Shift+7</kbd> Numbered List</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Shift+8</kbd> Bullet List</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+Shift+9</kbd> Check List</div>
            <div><kbd className="px-1 py-0.5 rounded bg-background border font-mono text-[10px]">Ctrl+\</kbd> Clear Format</div>
          </div>
        </div>
      </div>
    </div>
  );
}
