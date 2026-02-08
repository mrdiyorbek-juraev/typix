"use client";

import { AutocompleteExtension } from "@typix-editor/extension-auto-complete";
import { AutoLinkExtension } from "@typix-editor/extension-auto-link";
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";
import { KeywordsExtension } from "@typix-editor/extension-keywords";
import { LinkExtension } from "@typix-editor/extension-link";
import { MaxLengthExtension } from "@typix-editor/extension-max-length";
import { MentionExtension } from "@typix-editor/extension-mention";
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";
import {
  SpeechToTextExtension,
  useSpeechToText,
} from "@typix-editor/extension-speech-to-text";
import { TabFocusExtension } from "@typix-editor/extension-tab-focus";
import { FloatingLinkExtension } from "@typix-editor/extension-floating-link";
import { mockUsers } from "../constants";

export function EditorExtensions() {
  const handleMentionSearch = (query: string) =>
    mockUsers.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <>
      {/* Link plugin (URL validation & TOGGLE_LINK_COMMAND handler) */}
      <LinkExtension />

      {/* Auto-link URLs */}
      <AutoLinkExtension />

      {/* Keywords highlighting */}
      <KeywordsExtension />

      {/* @mentions */}
      <MentionExtension
        nodeConfig={{
          includeTrigger: false,
        }}
        onSearch={handleMentionSearch}
        onSelect={(mention) => {
          console.log("Mention selected:", mention);
        }}
        triggerConfig={{ trigger: "@" }}
      />

      {/* Character limit */}
      <MaxLengthExtension
        debug={false}
        maxLength={5000}
        onLimitReached={(current, max, exceeded) => {
          console.log(
            `Character limit: ${current}/${max} (exceeded: ${exceeded})`
          );
        }}
        strategy="trim"
      />

      {/* Autocomplete suggestions */}
      <AutocompleteExtension />

      {/* Drag & drop blocks */}
      <DraggableBlockExtension />

      {/* Right-click context menu */}
      <ContextMenuExtension
        options={[
          {
            type: "item",
            key: "cut",
            label: "Cut",
            onSelect: () => document.execCommand("cut"),
          },
          {
            type: "item",
            key: "copy",
            label: "Copy",
            onSelect: () => document.execCommand("copy"),
          },
          {
            type: "item",
            key: "paste",
            label: "Paste",
            onSelect: () => document.execCommand("paste"),
          },
          {
            type: "separator",
            key: "sep1",
          },
          {
            type: "item",
            key: "bold",
            label: "Bold",
            onSelect: (editor) => editor.toggleBold(),
          },
          {
            type: "item",
            key: "italic",
            label: "Italic",
            onSelect: (editor) => editor.toggleItalic(),
          },
          {
            type: "item",
            key: "underline",
            label: "Underline",
            onSelect: (editor) => editor.toggleUnderline(),
          },
          {
            type: "separator",
            key: "sep2",
          },
          {
            type: "item",
            key: "clear",
            label: "Clear Formatting",
            onSelect: (editor) => editor.clearFormatting(),
          },
        ]}
      />

      {/* Floating link editor */}
      <FloatingLinkExtension />

      {/* Tab focus */}
      <TabFocusExtension />

      {/* Keyboard shortcuts */}
      <ShortCutsExtension
        onLinkEditModeChange={(isLinkEditMode) => {
          console.log("Link edit mode:", isLinkEditMode);
        }}
      />

      {/* Speech-to-text */}
      <SpeechToTextExtension
        continuous={true}
        language="en-US"
        onError={(error) => console.error("Speech error:", error)}
        onResult={(result) => console.log("Speech result:", result)}
        onStart={() => console.log("Speech recognition started")}
        onStop={() => console.log("Speech recognition stopped")}
      />
    </>
  );
}



// Speech-to-text toggle button component
export function SpeechToTextButton() {
  const { isListening, isSupported, toggle } = useSpeechToText();

  if (!isSupported) {
    return null;
  }

  return (
    <button
      className={`rounded-md p-2 transition-colors ${isListening
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      onClick={toggle}
      title={isListening ? "Stop listening" : "Start speech-to-text"}
      type="button"
    >
      <svg
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    </button>
  );
}
