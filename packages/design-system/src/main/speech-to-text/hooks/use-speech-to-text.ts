import { useCallback, useEffect, useState } from "react";
import { useTypixEditorState } from "@typix-editor/react";
import { getExtensionOutput } from "@typix-editor/core";
import {
  isSpeechRecognitionSupported,
  SPEECH_TO_TEXT_COMMAND,
  SpeechToTextExtension,
  type SpeechToTextOutput,
} from "@typix-editor/extension-speech-to-text";
import type { UseSpeechToTextOptions, UseSpeechToTextReturn } from "../types";

/**
 * Hook to control speech-to-text functionality.
 *
 * @example
 * ```tsx
 * function MicrophoneButton() {
 *   const { isListening, isSupported, toggle } = useSpeechToText();
 *
 *   if (!isSupported) return <span>Speech not supported</span>;
 *
 *   return (
 *     <button onClick={toggle}>
 *       {isListening ? "Stop" : "Start"} Listening
 *     </button>
 *   );
 * }
 * ```
 */
export function useSpeechToText(
  options?: UseSpeechToTextOptions
): UseSpeechToTextReturn {
  const typixEditor = useTypixEditorState();
  const editor = typixEditor.lexical;
  const output = getExtensionOutput<SpeechToTextOutput>(editor, SpeechToTextExtension);

  const [isListening, setIsListening] = useState(
    () => output?.isListening.value ?? false
  );
  const [error, setError] = useState<Error | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  useEffect(() => {
    if (!output) return;
    return output.isListening.subscribe(setIsListening);
  }, [output]);

  const start = useCallback(() => {
    setError(null);
    editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, true);
    options?.onListeningChange?.(true);
  }, [editor, options]);

  const stop = useCallback(() => {
    editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, false);
    options?.onListeningChange?.(false);
  }, [editor, options]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return {
    isListening,
    isSupported,
    error,
    lastTranscript,
    start,
    stop,
    toggle,
  };
}
