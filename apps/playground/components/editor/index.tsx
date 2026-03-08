"use client";

import { EditorRoot, EditorContent, defaultTheme } from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { ImageExtension } from "@typix-editor/extension-image";
import { MentionExtension } from "@typix-editor/extension-mention";
import { PrettierFormatterExtension } from "@typix-editor/extension-code-block-prettier";
import { SpeechToTextExtension } from "@typix-editor/extension-speech-to-text";
import { MarkdownShortcutsExtension } from "@typix-editor/extension-markdown-shortcuts";
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";
import { TableExtension } from "@typix-editor/extension-table";
import {
  FloatingLinkUI,
  DraggableBlock,
  SlashDropdownMenu,
  CharacterLimit,
  EditorContextMenu,
  imageRenderer,
  MentionUI,
  CodeBlockToolbar,
} from "@typix-editor/ui";
import { EditorToolbar } from "./toolbar";
import { contextMenuItems } from "./context-menu-items";
import { searchMentions } from "@/mocks/users";

const extensions = [
  StarterKit(),
  FloatingLinkExtension(),
  ImageExtension({ component: imageRenderer }),
  MentionExtension({ trigger: "@" }),
  PrettierFormatterExtension({
    printOptions: { tabWidth: 2, semi: true, singleQuote: true },
  }),
  SpeechToTextExtension(),
  MarkdownShortcutsExtension(),
  TabFocusExtension(),
  TableExtension(),
];

export function FullEditor() {
  return (
    <div className="flex h-screen flex-col mt-[30px]">
      <EditorRoot
        extensions={extensions}
        namespace="playground"
        theme={defaultTheme}
      >
        <div className="fixed top-[45px] z-40 w-full bg-background">
          <EditorToolbar />
        </div>
        <EditorContextMenu items={contextMenuItems}>
          <div className="mx-auto max-w-[1200px] flex-1 overflow-y-auto">
            <EditorContent
              placeholder="Start typing… or type / for commands"
              className="min-h-[400px] bg-background p-4 font-sans"
            />
          </div>
        </EditorContextMenu>
        <FloatingLinkUI />
        <DraggableBlock />
        <SlashDropdownMenu />
        <MentionUI onSearch={searchMentions} />
        <CodeBlockToolbar />
        <div className="fixed bottom-0 right-0 left-0 z-40 dark:bg-muted-foreground/10 border-t">
          <CharacterLimit maxLength={10000} />
        </div>
      </EditorRoot>
    </div>
  );
}
