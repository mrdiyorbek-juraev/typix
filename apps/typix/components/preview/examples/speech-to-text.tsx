"use client";

import { StarterKit } from "@typix-editor/extension-starter-kit";
import { SpeechToTextExtension } from "@typix-editor/extension-speech-to-text";
import { SpeechToTextButton } from "@typix-editor/ui";
import { ExamplePreview } from "../example-preview";

const content = `<p>Click the microphone button below to start dictating. Your speech is transcribed in real time using the Web Speech API — no server or API key required.</p>`;

export default function SpeechToTextExample() {
  return (
    <ExamplePreview
      namespace="example-speech-to-text"
      extensions={[StarterKit(), SpeechToTextExtension]}
      content={content}
      placeholder="Click the microphone button to dictate. Uses the Web Speech API."
      footer={
        <div className="flex items-center justify-end px-2 py-1.5">
          <SpeechToTextButton hideWhenUnsupported />
        </div>
      }
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
import { StarterKit } from "@typix-editor/extension-starter-kit";
import { SpeechToTextExtension } from "@typix-editor/extension-speech-to-text";
import { SpeechToTextButton } from "@/components/typix/main/speech-to-text";

const extensions = [StarterKit(), SpeechToTextExtension];

export function Editor() {
  const editor = useTypixEditor({
    extensions,
    theme: defaultTheme,
    namespace: "my-editor",
  });

  return (
    <TypixEditorContext.Provider value={{ editor }}>
      <EditorContent editor={editor} placeholder="Dictate..." />
      <SpeechToTextButton hideWhenUnsupported />
    </TypixEditorContext.Provider>
  );
}`,
  },
];
