"use client";
import { EditorRoot, EditorContent, defaultTheme } from "@typix-editor/react";
import { defineExtension } from "lexical";
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
  CodeBlockUI,
  TableUI,
} from "@typix-editor/ui";
import { EditorToolbar } from "./toolbar";
import { contextMenuItems } from "./context-menu-items";
import { searchMentions } from "@/mocks/users";
import { CodeBlockExtension } from "@typix-editor/extensions/code-block";
import { defaultContent } from "@/lib/default-content";

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
  CodeBlockExtension(),
];

const rootExtension = defineExtension({
  name: "typix/playground",
  namespace: "playground",
  theme: defaultTheme,
  dependencies: extensions.map((e) => e.typix),
  $initialEditorState: JSON.stringify(defaultContent),
});

export function FullEditor() {
  return (
    <div className="mt-[30px]">
      <EditorRoot extension={rootExtension} extensions={extensions}>
        <div className="fixed top-[45px] z-40 w-full bg-background">
          <EditorToolbar />
        </div>
        <EditorContextMenu items={contextMenuItems}>
          <div className="mx-auto max-w-[1200px] pb-12">
            <EditorContent
              placeholder="Start typing… or type / for commands"
              className="bg-background p-4 font-sans"
              classNames={{
                scroller: "resize-none! overflow-visible!",
                contentEditable: "[&>*+*]:mt-5!",
              }}
            />
          </div>
        </EditorContextMenu>
        <FloatingLinkUI />
        <DraggableBlock />
        <SlashDropdownMenu />
        <CodeBlockUI />
        <TableUI />
        <MentionUI onSearch={searchMentions} />
        <div className="fixed bottom-0 right-0 left-0 z-50 bg-white shadow-md dark:bg-muted-foreground/10 border-t">
          <CharacterLimit maxLength={10000} />
        </div>
      </EditorRoot>
    </div>
  );
}
