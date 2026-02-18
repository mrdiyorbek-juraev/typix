"use client";

import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import {
  SpeechToTextExtension,
  useSpeechToText,
  isSpeechRecognitionSupported,
} from "@typix-editor/extension-speech-to-text";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
});

function MicButton() {
  const { isListening, toggle } = useSpeechToText();

  if (!isSpeechRecognitionSupported()) {
    return (
      <p className="text-xs text-fd-muted-foreground">
        Speech recognition is not supported in your browser.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
    >
      {isListening ? "Stop Listening" : "Start Dictation"}
    </button>
  );
}

export default function SpeechToTextExample() {
  return (
    <EditorRoot config={config}>
      <div className="mb-3">
        <MicButton />
      </div>
      <EditorContent
        placeholder="Click 'Start Dictation' and speak..."
        className="min-h-[120px] w-full rounded-md border border-fd-border bg-fd-background p-3 text-sm focus-within:ring-2 focus-within:ring-fd-ring"
      />
      <SpeechToTextExtension />
    </EditorRoot>
  );
}

export const files = [
  {
    name: "Editor.tsx",
    lang: "tsx",
    code: `import {
  EditorContent,
  EditorRoot,
  createEditorConfig,
  defaultExtensionNodes,
} from "@typix-editor/react";
import {
  SpeechToTextExtension,
  useSpeechToText,
  isSpeechRecognitionSupported,
} from "@typix-editor/extension-speech-to-text";
import { theme } from "./theme";
import "./style.css";

const config = createEditorConfig({
  extensionNodes: defaultExtensionNodes,
  theme,
});

function MicButton() {
  const { isListening, toggle } = useSpeechToText();

  if (!isSpeechRecognitionSupported()) return null;

  return (
    <button onClick={toggle}>
      {isListening ? "Stop Listening" : "Start Dictation"}
    </button>
  );
}

export default function SpeechToTextExample() {
  return (
    <EditorRoot config={config}>
      <MicButton />
      <EditorContent placeholder="Click 'Start Dictation' and speak..." />
      <SpeechToTextExtension />
    </EditorRoot>
  );
}`,
  },
  {
    name: "theme.ts",
    lang: "ts",
    code: `import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  paragraph: "typix-paragraph",
  text: {
    bold: "typix-text--bold",
    italic: "typix-text--italic",
    underline: "typix-text--underline",
    strikethrough: "typix-text--strikethrough",
    code: "typix-text--code",
  },
};`,
  },
  {
    name: "style.css",
    lang: "css",
    code: `.typix-paragraph {
  margin: 0;
  position: relative;
}

.typix-text--bold { font-weight: bold; }
.typix-text--italic { font-style: italic; }
.typix-text--underline { text-decoration: underline; }
.typix-text--strikethrough { text-decoration: line-through; }
.typix-text--code {
  background-color: rgb(240, 242, 245);
  padding: 1px 0.25rem;
  font-family: Menlo, Consolas, Monaco, monospace;
  font-size: 94%;
}`,
  },
];
