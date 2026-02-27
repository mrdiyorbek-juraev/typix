import { signal, type Signal } from "@lexical/extension";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  REDO_COMMAND,
  UNDO_COMMAND,
  createCommand,
  defineExtension,
  safeCast,
  type LexicalCommand,
  type LexicalEditor,
} from "lexical";

import type {
  SpeechRecognitionResult,
  SpeechToTextConfig,
  VoiceCommands,
} from "../types";

// ============================================================================
// Web Speech API Types (not included in standard TypeScript lib)
// ============================================================================

interface WebSpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface WebSpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): WebSpeechRecognitionAlternative;
  [index: number]: WebSpeechRecognitionAlternative;
}

interface WebSpeechRecognitionResultList {
  readonly length: number;
  item(index: number): WebSpeechRecognitionResult;
  [index: number]: WebSpeechRecognitionResult;
}

interface WebSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: WebSpeechRecognitionResultList;
}

interface WebSpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface WebSpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
}

interface WebSpeechRecognitionConstructor {
  new (): WebSpeechRecognitionInstance;
}

// ============================================================================
// Commands
// ============================================================================

export const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand(
  "SPEECH_TO_TEXT_COMMAND"
);

// ============================================================================
// Default Voice Commands
// ============================================================================

const DEFAULT_VOICE_COMMANDS: VoiceCommands = {
  "new line": ({ selection }) => {
    selection.insertParagraph();
  },
  "new paragraph": ({ selection }) => {
    selection.insertParagraph();
  },
  undo: ({ editor }) => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  },
  redo: ({ editor }) => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Check if speech recognition is supported (safe for SSR)
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

function getSpeechRecognitionConstructor(): WebSpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  return (
    (
      window as unknown as {
        SpeechRecognition?: WebSpeechRecognitionConstructor;
      }
    ).SpeechRecognition ||
    (
      window as unknown as {
        webkitSpeechRecognition?: WebSpeechRecognitionConstructor;
      }
    ).webkitSpeechRecognition ||
    null
  );
}

// ============================================================================
// Output
// ============================================================================

export interface SpeechToTextOutput {
  /** Whether speech recognition is currently listening. */
  isListening: Signal<boolean>;
}

const _outputByEditor = new WeakMap<LexicalEditor, SpeechToTextOutput>();

export function getSpeechToTextOutput(
  editor: LexicalEditor
): SpeechToTextOutput | undefined {
  return _outputByEditor.get(editor);
}

// ============================================================================
// Extension
// ============================================================================

export const SpeechToTextExtension = defineExtension({
  name: "@typix/speech-to-text",

  config: safeCast<SpeechToTextConfig>({
    disabled: false,
    language: "en-US",
    continuous: true,
    interimResults: true,
    maxAlternatives: 1,
    voiceCommands: {},
    includeDefaultCommands: true,
  }),

  build(editor) {
    const isListening = signal(false);
    const output: SpeechToTextOutput = { isListening };
    _outputByEditor.set(editor, output);
    return output;
  },

  register(editor, config, state) {
    const { isListening } = state.getOutput();

    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    let recognition: WebSpeechRecognitionInstance | null = null;

    // Merge voice commands
    const voiceCommands: VoiceCommands = {};
    if (config.includeDefaultCommands) {
      Object.assign(voiceCommands, DEFAULT_VOICE_COMMANDS);
    }
    if (config.voiceCommands) {
      Object.assign(voiceCommands, config.voiceCommands);
    }

    function handleResult(event: WebSpeechRecognitionEvent) {
      const resultItem = event.results[event.resultIndex];
      if (!resultItem) return;

      const firstAlternative = resultItem[0];
      if (!firstAlternative) return;

      const { transcript, confidence } = firstAlternative;
      const isFinal = resultItem.isFinal;

      config.onResult?.({ transcript, confidence, isFinal });

      if (!isFinal) return;

      const processedTranscript = config.processTranscript
        ? config.processTranscript(transcript)
        : transcript;

      if (processedTranscript === null) return;

      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const normalizedCommand = processedTranscript.toLowerCase().trim();
          const commandHandler = voiceCommands[normalizedCommand];

          if (commandHandler) {
            commandHandler({ editor, selection });
          } else if (processedTranscript.match(/\s*\n\s*/)) {
            selection.insertParagraph();
          } else {
            selection.insertText(processedTranscript);
          }
        }
      });
    }

    function startRecognition() {
      if (!SpeechRecognitionCtor || recognition) return;

      recognition = new SpeechRecognitionCtor();
      recognition.continuous = config.continuous;
      recognition.interimResults = config.interimResults;
      recognition.maxAlternatives = config.maxAlternatives;
      recognition.lang = config.language;

      recognition.addEventListener("result", ((
        e: WebSpeechRecognitionEvent
      ) => {
        handleResult(e);
      }) as EventListener);

      recognition.addEventListener("start", () => {
        config.onStart?.();
      });

      recognition.addEventListener("end", () => {
        config.onStop?.();
        if (isListening.value && config.continuous && recognition) {
          try {
            recognition.start();
          } catch {
            // Already started or other error
          }
        }
      });

      recognition.addEventListener("error", ((
        event: WebSpeechRecognitionErrorEvent
      ) => {
        const error = new Error(`Speech recognition error: ${event.error}`);
        config.onError?.(error);
      }) as EventListener);

      recognition.addEventListener("nomatch", () => {
        config.onNoMatch?.();
      });

      try {
        recognition.start();
      } catch {
        // Already started
      }
    }

    function stopRecognition() {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
    }

    return mergeRegister(
      editor.registerCommand(
        SPEECH_TO_TEXT_COMMAND,
        (newIsEnabled: boolean) => {
          isListening.value = newIsEnabled;
          if (newIsEnabled) {
            startRecognition();
          } else {
            stopRecognition();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      () => {
        stopRecognition();
      }
    );
  },
});
