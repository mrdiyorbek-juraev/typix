"use client";

import { AutoLinkExtension } from "@typix-editor/extension-auto-link";
import { MaxLengthExtension } from "@typix-editor/extension-max-length";
import { AutocompleteExtension } from "@typix-editor/extension-auto-complete";
import { KeywordsExtension } from "@typix-editor/extension-keywords";
import { MentionExtension } from "@typix-editor/extension-mention";
import { DraggableBlockExtension } from "@typix-editor/extension-draggable-block";
import { ContextMenuExtension } from "@typix-editor/extension-context-menu";
import { ShortCutsExtension } from "@typix-editor/extension-short-cuts";
import { mockUsers } from "../constants";

export function EditorExtensions() {
  const handleMentionSearch = (query: string) => {
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <>
      {/* Auto-link URLs */}
      <AutoLinkExtension />

      {/* Keywords highlighting */}
      <KeywordsExtension />

      {/* @mentions */}
      <MentionExtension
        onSearch={handleMentionSearch}
        onSelect={(mention) => {
          console.log("Mention selected:", mention);
        }}
        nodeConfig={{
          includeTrigger: false,
        }}
        triggerConfig={{ trigger: "@" }}
      />

      {/* Character limit */}
      <MaxLengthExtension
        maxLength={5000}
        strategy="trim"
        debug={false}
        onLimitReached={(current, max, exceeded) => {
          console.log(`Character limit: ${current}/${max} (exceeded: ${exceeded})`);
        }}
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

      {/* Keyboard shortcuts */}
      <ShortCutsExtension
        onLinkEditModeChange={(isLinkEditMode) => {
          console.log("Link edit mode:", isLinkEditMode);
        }}
      />
    </>
  );
}
