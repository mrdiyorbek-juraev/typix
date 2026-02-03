"use client";
import {
  $createHeadingNode,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $setBlocksType,
  createCommand,
  createEditorConfig,
  defaultExtensionNodes,
  defaultTheme,
  EditorBubbleItem,
  EditorBubbleMenu,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  FORMAT_TEXT_COMMAND,
  useEditor,
} from "@typix-editor/react";
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";
import { MaxLengthExtension } from "@typix-editor/extension-max-length";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  AutocompleteExtension,
  AutocompleteNode,
} from "@typix-editor/extension-auto-complete";
import {
  KeywordNode,
  KeywordsExtension,
} from "@typix-editor/extension-keywords";
import { MentionExtension, MentionNode } from "@typix-editor/extension-mention";
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as any;

const ParagraphPicker = createCommand({
  title: "Text",
  icon: <div>P</div>,
  keywords: ["text", "p", "paragraph"],
  description: "Just start writing with plain text",
  onSelect: (_, editor) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  },
});

const HeadingPicker = createCommand({
  title: "Heading 1",
  icon: <div>H1</div>,
  keywords: ["heading", "header", `h${1}`, "basic_blocks"],
  description: "Just start writing with plain text",
  onSelect: (_, editor) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(`h${1}`));
      }
    }),
});

const commands = [ParagraphPicker, HeadingPicker];

const extensions = [
  ...defaultExtensionNodes,
  AutocompleteNode,
  KeywordNode,
  MentionNode,
];

const TestIsEmpty = () => {
  const { isEmpty } = useEditor();
  console.log(isEmpty);
  return null;
};

const users = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
];

const HomePage = () => {
  const [editorState, setEditorState] = useState<any | null>(initialValue);
  const handleSearch = (query: string) => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  };
  const config = createEditorConfig({
    namespace: "typix-editor",
    extension_nodes: extensions,
    editable: true,
    editorState: null,
    initialState: initialValue,
    theme: defaultTheme,
  });
  return (
    <div className="flex flex-col justify-center flex-1 w-full space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to Typix</h1>
        <p className="text-center">
          You can open{" "}
          <Link href="/docs" className="font-medium underline">
            /docs
          </Link>{" "}
          and see the documentation.
        </p>
      </div>
      <div className="w-full max-w-[80%] mx-auto">
        <EditorRoot
          config={config}
          content={editorState}
          onContentChange={setEditorState}
        >
          <EditorContent
            placeholder="Pls write something"
            className="border border-border rounded-md"
          >
            {/* Bubble menu */}
            <EditorBubbleMenu className="floating-text-format-popup">
              <EditorBubbleItem
                name="bold"
                onSelect={(editor) => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
              >
                {({ isActive }) => (
                  <button className={isActive ? "bg-blue-500 text-white" : ""}>
                    Bold
                  </button>
                )}
              </EditorBubbleItem>
            </EditorBubbleMenu>

            {/* EditorCommand */}
            <EditorCommand items={commands} trigger="/">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {commands?.map((item) => (
                  <EditorCommandItem
                    key={item.title}
                    value={item.title}
                    keywords={item.keywords}
                    onSelect={item.onSelect}
                    className="flex items-center gap-3 px-3 py-2 rounded-md min-w-[200px]"
                  >
                    {({ isSelected, value }) => (
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md",
                          isSelected && "bg-accent"
                        )}
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-md border">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.shortDescription}
                          </p>
                        </div>
                        {item.keyboardShortcut && (
                          <kbd className="text-xs px-1.5 py-0.5 rounded bg-muted">
                            {item.keyboardShortcut}
                          </kbd>
                        )}
                      </div>
                    )}
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>

            {/* AutoLinkExtension */}
            <AutoLinkExtension />

            {/* KeywordsExtension */}
            <KeywordsExtension />
            {/* MentionExtension */}
            <MentionExtension
              onSearch={handleSearch}
              onSelect={(mention) => {
                console.log(mention);
              }}
              nodeConfig={{
                includeTrigger: false,
              }}
              triggerConfig={{ trigger: "@" }}
            />

            {/* MaxLengthExtension */}
            <MaxLengthExtension
              maxLength={50}
              strategy="trim"
              debug={true}
              onLimitReached={(current, max, exceeded) => {
                console.log(`Trimmed ${exceeded} characters`);
              }}
            />

            <AutocompleteExtension />

            <DraggableBlockExtension />

            <ContextMenuExtension
              options={[
                {
                  type: 'item',
                  key: 'test',
                  label: 'Test',
                  onSelect: (editor) => {
                    console.log('Test', editor);
                  },
                },
              ]}
            />

            <TestIsEmpty />
          </EditorContent>
        </EditorRoot>
      </div>
    </div>
  );
};

export default HomePage;
