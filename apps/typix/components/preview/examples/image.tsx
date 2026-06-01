"use client";

import { useRef, useCallback } from "react";
import { configExtension } from "@typix-editor/core";
import type { SerializedContent } from "@typix-editor/core";
import { useTypixEditorState } from "@typix-editor/react";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import {
  ImageExtension,
  INSERT_IMAGE_COMMAND,
} from "@typix-editor/extension-image";
import { imageRenderer } from "@typix-editor/ui";
import { ImagePlus } from "lucide-react";
import { ExamplePreview } from "../example-preview";

function ImageInsertButton() {
  const editor = useTypixEditorState();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
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
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        title="Insert image"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex h-7 w-7 items-center justify-center rounded-sm text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ImagePlus size={14} />
      </button>
    </>
  );
}

const content: SerializedContent = {
  root: {
    type: "root",
    version: 1,
    direction: "ltr",
    format: 0,
    indent: 0,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        textStyle: "",
        children: [
          {
            type: "text",
            version: 1,
            text: "Images are block-level nodes. Click to select, then drag the handles to resize or use the toolbar to align. You can also drop or paste an image directly.",
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
          },
        ],
      },
      {
        type: "image",
        version: 1,
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop&q=80",
        altText: "Mountain landscape",
        width: 800,
        height: 534,
        maxWidth: 800,
        showCaption: true,
        caption: "Mountain landscape — drag the corners to resize",
        alignment: "center",
      },
    ],
  },
};

export default function ImageExample() {
  return (
    <ExamplePreview
      namespace="example-image"
      extensions={[
        StarterKit(),
        configExtension(ImageExtension, { component: imageRenderer }),
      ]}
      content={content}
      placeholder="Drop or paste an image, or use the toolbar button."
      toolbarExtra={<ImageInsertButton />}
    />
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `"use client";
import { useRef, useCallback } from "react";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
  useTypixEditorState,
} from "@typix-editor/react";
import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { ImageExtension, INSERT_IMAGE_COMMAND } from "@typix-editor/extension-image";
import { imageRenderer } from "@/components/typix/main/image";
import { ImagePlus } from "lucide-react";

function ImageInsertButton() {
  const editor = useTypixEditorState();
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
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
  }, [editor]);

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button type="button" onClick={() => inputRef.current?.click()}>
        <ImagePlus size={14} />
      </button>
    </>
  );
}

const extensions = [
  StarterKit(),
  configExtension(ImageExtension, { component: imageRenderer }),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Drop or paste an image...">
        <ImageInsertButton />
      </EditorContent>
    </TypixEditorContext.Provider>
  );
}`,
  },
];
