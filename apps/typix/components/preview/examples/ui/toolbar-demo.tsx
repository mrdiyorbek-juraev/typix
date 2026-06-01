"use client";

import type { ReactNode } from "react";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@typix-editor/ui";

interface ToolbarDemoProps {
  namespace: string;
  children: ReactNode;
  content?: string;
  placeholder?: string;
}

export function ToolbarDemo({
  namespace,
  children,
  content,
  placeholder = "Start typing...",
}: ToolbarDemoProps) {
  const editor = useTypixEditor({
    extensions: [StarterKit()],
    theme: defaultTheme,
    namespace,
    content,
    immediatelyRender: false,
  });

  if (!editor) {
    return <div className="min-h-[160px] animate-pulse bg-muted/20" />;
  }

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <div
        className="relative w-full overflow-hidden bg-background"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Toolbar className="border-fd-border flex-wrap border-b px-2 py-1">
          <ToolbarGroup>{children}</ToolbarGroup>
        </Toolbar>
        <EditorContent
          editor={editor}
          className="min-h-[120px] overflow-y-auto text-sm"
          classNames={{ contentEditable: "px-4 py-3 outline-none" }}
          placeholder={placeholder}
        />
      </div>
    </TypixEditorContext.Provider>
  );
}

export { ToolbarSeparator };
