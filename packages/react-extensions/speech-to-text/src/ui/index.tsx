import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";

import {
  getSpeechToTextOutput,
  isSpeechRecognitionSupported,
  SPEECH_TO_TEXT_COMMAND,
} from "@typix-editor/extension-speech-to-text";
import type { SpeechToTextState } from "@typix-editor/extension-speech-to-text";

export interface UseSpeechToTextOptions {
  /**
   * Callback when listening state changes
   */
  onListeningChange?: (isListening: boolean) => void;
}

export interface UseSpeechToTextReturn extends SpeechToTextState {
  /** Start speech recognition */
  start: () => void;
  /** Stop speech recognition */
  stop: () => void;
  /** Toggle speech recognition */
  toggle: () => void;
}

/**
 * Hook to control speech-to-text functionality.
 *
 * @example
 * ```tsx
 * function MicrophoneButton() {
 *   const { isListening, isSupported, start, stop, toggle } = useSpeechToText();
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
  const [editor] = useLexicalComposerContext();
  const output = getSpeechToTextOutput(editor);

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
