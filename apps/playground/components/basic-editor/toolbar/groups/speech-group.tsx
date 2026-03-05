"use client";

import { Mic, MicOff } from "lucide-react";
import { useCallback, useState } from "react";
import { ToolbarButton } from "../toolbar-button";
import { useTypixEditorState } from "@typix-editor/react";

export function SpeechGroup() {
  const editor = useTypixEditorState();
  const [isListening, setIsListening] = useState(false);

  const toggle = useCallback(() => {
    const next = !isListening;
    setIsListening(next);
    editor.run("toggleSpeechToText");
  }, [editor, isListening]);

  return (
    <>
      <ToolbarButton
        onClick={toggle}
        active={isListening}
        title={isListening ? "Stop speech-to-text" : "Start speech-to-text"}
      >
        {isListening ? (
          <MicOff className="size-3.5" />
        ) : (
          <Mic className="size-3.5" />
        )}
      </ToolbarButton>
    </>
  );
}
