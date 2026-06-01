"use client";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import type { AnyLexicalExtensionArgument } from "lexical";
import { configExtension } from "lexical";
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
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { defaultContent } from "@/lib/default-content";
import type { SerializedContent } from "@typix-editor/core";

// Use tuple form (no [0]!) so configExtension's options actually reach the
// extension. configExtension returns [Extension, ...configs] — indexing [0]
// throws the config away, leaving the image renderer / mention trigger /
// prettier opts unset.
const extensions: AnyLexicalExtensionArgument[] = [
  StarterKit({CodeBlockExtension: false}),
  FloatingLinkExtension,
  configExtension(ImageExtension, { component: imageRenderer }),
  configExtension(MentionExtension, { trigger: "@" }),
  configExtension(PrettierFormatterExtension, {
    printOptions: { tabWidth: 2, semi: true, singleQuote: true },
  }),
  SpeechToTextExtension,
  MarkdownShortcutsExtension,
  TabFocusExtension,
  TableExtension,
  CodeBlockExtension,
];

// Pretty tagged logger so the console makes it obvious which option fired.
const log = (tag: string, payload?: unknown) =>
  // eslint-disable-next-line no-console
  console.log(
    `%c[useTypixEditor]%c ${tag}`,
    "color:#fff;background:#7c3aed;padding:2px 6px;border-radius:3px;font-weight:600",
    "color:#7c3aed;font-weight:600",
    payload ?? ""
  );

// Throttle transaction logs so typing doesn't flood the console.
let txCount = 0;

export function FullEditor() {
  const editor = useTypixEditor({
    // ── Core options ───────────────────────────────────
    extensions,
    namespace: "playground",
    theme: defaultTheme,
    content: defaultContent as unknown as SerializedContent,
    editable: true,
    autofocus: "end",
    immediatelyRender: false, // SSR-safe (Next.js App Router)
    onError: (err) => log("onError", err),

    // ── Lifecycle hooks ────────────────────────────────
    onBeforeCreate: ({ options }) =>
      log("onBeforeCreate", { extensionCount: options.extensions.length }),

    onCreate: ({ editor }) => {
      log("onCreate", {
        id: editor.id,
        namespace: editor.namespace,
        isEditable: editor.isEditable(),
        isEmpty: editor.isEmpty(),
      });
      // Expose to window for ad-hoc poking from the console.
      (window as unknown as { typix: unknown }).typix = editor;
      log(
        "💡 tip",
        "editor is on window.typix — try window.typix.chain().toggleBold().run()"
      );
    },

    onUpdate: ({ editor }) =>
      log("onUpdate", { length: editor.getText().length }),

    onContentUpdate: ({ editor }) =>
      log("onContentUpdate (nodes changed)", {
        empty: editor.isEmpty(),
        textLen: editor.getText().length,
      }),

    onSelectionUpdate: () => log("onSelectionUpdate (selection moved only)"),

    onTransaction: ({ dirtyElements, dirtyLeaves, tags }) => {
      txCount += 1;
      // First 5 + every 25th to avoid console spam on heavy typing.
      if (txCount <= 5 || txCount % 25 === 0) {
        log(`onTransaction #${txCount}`, {
          dirtyElements: dirtyElements.size,
          dirtyLeaves: dirtyLeaves.size,
          tags: [...tags],
        });
      }
    },

    onFocus: () => log("onFocus"),
    onBlur: () => log("onBlur"),

    onEditableChange: ({ editable }) => log("onEditableChange", { editable }),

    onDestroy: () => log("onDestroy"),
  });

  if (!editor) return null;

  return (
    <div className="mt-[30px]">
      <TypixEditorContext.Provider value={{ editor }}>
        <div className="fixed top-[45px] z-40 w-full bg-background">
          <EditorToolbar />
        </div>
        <EditorContextMenu items={contextMenuItems}>
          <div className="mx-auto max-w-[1200px] pb-12">
            <EditorContent
              editor={editor}
              placeholder="Start typing… or type / for commands"
              className="bg-background p-4 font-sans"
              classNames={{
                scroller: "resize-none! overflow-visible!",
                contentEditable: "[&>*+*]:mt-5!",
              }}
            >
              <FloatingLinkUI />
              <DraggableBlock />
              <SlashDropdownMenu />
              <CodeBlockUI />
              <TableUI />
              <MentionUI onSearch={searchMentions} />
            </EditorContent>
          </div>
        </EditorContextMenu>
        <div className="fixed bottom-0 right-0 left-0  bg-white shadow-md dark:bg-muted-foreground/10 border-t">
          <CharacterLimit maxLength={10000} />
        </div>
      </TypixEditorContext.Provider>
    </div>
  );
}
