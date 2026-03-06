"use client";

import { Mic } from "lucide-react";
import { ToolbarButton } from "../toolbar-button";
import { useSpeechToText } from "@typix-editor/ui";

export function SpeechGroup() {
  const { isListening, isSupported, toggle } = useSpeechToText();

  if (!isSupported) return null;

  return (
    <ToolbarButton
      onClick={toggle}
      active={isListening}
      title={isListening ? "Stop speech-to-text" : "Start speech-to-text"}
    >
      {isListening ? (
        <span className="relative flex items-center justify-center">
          <span className="absolute size-3.5 animate-ping rounded-full bg-destructive/30" />
          <Mic className="relative size-3.5" />
        </span>
      ) : (
        <Mic className="size-3.5" />
      )}
    </ToolbarButton>
  );
}
