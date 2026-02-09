"use client";
import {
  createEditorConfig,
  EditorContent,
  EditorRoot,
} from "@typix-editor/react";
import { useMemo, useState } from "react";
import { defaultValue } from "./lib/default-value";
import { extensionNodes } from "./lib/extension-nodes";
import { EditorTheme } from "./lib/theme";
import { Toolbar } from "./components/toolbar";
import { BubbleMenu } from "./components/bubble-menu";
import { CommandMenu } from "./components/coommand-menu";
import { slashCommands } from "./lib/slash-commands";

const Editor = () => {
  const [editorState, setEditorState] = useState<any>(defaultValue);
  const config = useMemo(
    () =>
      createEditorConfig({
        namespace: "typix-editor",
        extension_nodes: extensionNodes,
        editable: true,
        editorState: null,
        initialState: editorState,
        theme: EditorTheme,
      }),
    []
  );
  return (
    <div>
      <EditorRoot
        config={config}
        content={editorState}
        onContentChange={setEditorState}
      >
        <Toolbar />
        <EditorContent
          className="min-h-[400px] rounded-lg border border-border bg-background p-4"
          placeholder="Start typing... Use / for commands, @ for mentions"
        >
          <BubbleMenu />
          <CommandMenu commands={slashCommands} />
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default Editor;
