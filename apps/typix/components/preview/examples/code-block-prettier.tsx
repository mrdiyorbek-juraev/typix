"use client";

import { configExtension } from "@typix-editor/core";
import type { SerializedContent } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { PrettierFormatterExtension } from "@typix-editor/extension-code-block-prettier";
import { CodeBlockUI } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content: SerializedContent = {
  root: {
    children: [
      {
        type: "code",
        version: 1,
        language: "javascript",
        direction: "ltr",
        format: "",
        indent: 0,
        children: [
          {
            type: "code-highlight",
            version: 1,
            text: "function   fetchUser(id,opts){\nvar url='/api/users/'+id\nreturn fetch(url,{method:'GET',headers:{'Content-Type':'application/json'}}).then(function(res){if(!res.ok){throw new Error('Request failed: '+res.status)}return res.json()}).then(function(data){return data}).catch(function(err){console.error(err);throw err})\n}",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            highlightType: null,
          },
        ],
      },
    ],
    direction: "ltr",
    format: 0,
    indent: 0,
    type: "root",
    version: 1,
  },
};

export default function CodeBlockPrettierExample() {
  return (
    <ExamplePreview
      namespace="example-code-block-prettier"
      extensions={[
        StarterKit(),
        CodeBlockExtension,
        configExtension(PrettierFormatterExtension, {
          printOptions: { tabWidth: 2, semi: true, singleQuote: true },
        }),
      ]}
      content={content}
      placeholder="Insert a code block, paste unformatted code, then click the wand icon to format."
      overlays={<CodeBlockUI />}
    />
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `"use client";
import {
  EditorContent,
  TypixEditorContext,
  defaultTheme,
  useTypixEditor,
} from "@typix-editor/react";
import { configExtension } from "@typix-editor/core";
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { CodeBlockExtension } from "@typix-editor/extension-code-block";
import { PrettierFormatterExtension } from "@typix-editor/extension-code-block-prettier";
import { CodeBlockUI } from "@/components/typix/main/code-block";

const extensions = [
  StarterKit(),
  CodeBlockExtension,
  configExtension(PrettierFormatterExtension, {
    printOptions: { tabWidth: 2, semi: true, singleQuote: true },
  }),
];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Paste code and format..." />
      <CodeBlockUI />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
