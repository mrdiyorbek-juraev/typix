import { useTypixEditor } from "@typix-editor/react";
import type { LexicalCommand, LexicalEditor, RangeSelection } from "lexical";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
// Types
// ============================================================================

export type VoiceCommandHandler = (context: {
  editor: LexicalEditor;
  selection: RangeSelection;
}) => void;

export type VoiceCommands = Record<string, VoiceCommandHandler>;

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechToTextState {
  /** Whether speech recognition is currently active */
  isListening: boolean;
  /** Whether browser supports speech recognition */
  isSupported: boolean;
  /** Current error if any */
  error: Error | null;
  /** Last recognized transcript */
  lastTranscript: string | null;
}

export interface SpeechToTextExtensionProps {
  /**
   * Language for speech recognition (BCP-47 language tag)
   * @default "en-US"
   * @example "es-ES", "fr-FR", "de-DE"
   */
  language?: string;

  /**
   * Whether to continuously listen or stop after first result
   * @default true
   */
  continuous?: boolean;

  /**
   * Whether to return interim (partial) results
   * @default true
   */
  interimResults?: boolean;

  /**
   * Maximum alternatives for each result
   * @default 1
   */
  maxAlternatives?: number;

  /**
   * Custom voice commands to extend or override defaults
   * Keys are lowercase command phrases, values are handler functions
   * @example { "bold text": ({ editor }) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") }
   */
  voiceCommands?: VoiceCommands;

  /**
   * Whether to include default voice commands (undo, redo, new line)
   * @default true
   */
  includeDefaultCommands?: boolean;

  /**
   * Callback when speech recognition starts
   */
  onStart?: () => void;

  /**
   * Callback when speech recognition stops
   */
  onStop?: () => void;

  /**
   * Callback when speech recognition produces a result
   */
  onResult?: (result: SpeechRecognitionResult) => void;

  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;

  /**
   * Callback when no speech is detected for a period
   */
  onNoMatch?: () => void;

  /**
   * Custom transcript processor before insertion
   * Return null to skip insertion
   * @example (transcript) => transcript.replace(/um|uh/gi, "").trim()
   */
  processTranscript?: (transcript: string) => string | null;
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

/**
 * Get the SpeechRecognition constructor (safe for SSR)
 */
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
// Extension Component
// ============================================================================

function SpeechToTextComponent({
  language = "en-US",
  continuous = true,
  interimResults = true,
  maxAlternatives = 1,
  voiceCommands: customVoiceCommands,
  includeDefaultCommands = true,
  onStart,
  onStop,
  onResult,
  onError,
  onNoMatch,
  processTranscript,
}: SpeechToTextExtensionProps): null {
  const { lexical: editor } = useTypixEditor();
  const [isEnabled, setIsEnabled] = useState(false);
  const recognitionRef = useRef<WebSpeechRecognitionInstance | null>(null);

  // Merge voice commands
  const voiceCommands = useMemo<VoiceCommands>(() => {
    const commands: VoiceCommands = {};
    if (includeDefaultCommands) {
      Object.assign(commands, DEFAULT_VOICE_COMMANDS);
    }
    if (customVoiceCommands) {
      Object.assign(commands, customVoiceCommands);
    }
    return commands;
  }, [includeDefaultCommands, customVoiceCommands]);

  // Handle speech result
  const handleResult = useCallback(
    (event: WebSpeechRecognitionEvent) => {
      const resultItem = event.results[event.resultIndex];
      if (!resultItem) return;

      const firstAlternative = resultItem[0];
      if (!firstAlternative) return;

      const { transcript, confidence } = firstAlternative;
      const isFinal = resultItem.isFinal;

      // Call onResult callback
      onResult?.({ transcript, confidence, isFinal });

      // Only process final results for insertion
      if (!isFinal) return;

      // Process transcript if processor provided
      const processedTranscript = processTranscript
        ? processTranscript(transcript)
        : transcript;

      if (processedTranscript === null) return;

      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const normalizedCommand = processedTranscript.toLowerCase().trim();
          const commandHandler = voiceCommands[normalizedCommand];

          if (commandHandler) {
            commandHandler({
              editor,
              selection,
            });
          } else if (processedTranscript.match(/\s*\n\s*/)) {
            selection.insertParagraph();
          } else {
            selection.insertText(processedTranscript);
          }
        }
      });
    },
    [editor, voiceCommands, processTranscript, onResult]
  );

  // Initialize and manage speech recognition
  useEffect(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) return;

    if (isEnabled && !recognitionRef.current) {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = maxAlternatives;
      recognition.lang = language;

      recognition.addEventListener("result", ((
        e: WebSpeechRecognitionEvent
      ) => {
        handleResult(e);
      }) as EventListener);

      recognition.addEventListener("start", () => {
        onStart?.();
      });

      recognition.addEventListener("end", () => {
        onStop?.();
        // Auto-restart if still enabled and continuous
        if (isEnabled && continuous && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            // Already started or other error, ignore
          }
        }
      });

      recognition.addEventListener("error", ((
        event: WebSpeechRecognitionErrorEvent
      ) => {
        const error = new Error(`Speech recognition error: ${event.error}`);
        onError?.(error);
      }) as EventListener);

      recognition.addEventListener("nomatch", () => {
        onNoMatch?.();
      });

      recognitionRef.current = recognition;
    }

    if (recognitionRef.current) {
      if (isEnabled) {
        try {
          recognitionRef.current.start();
        } catch {
          // Already started, ignore
        }
      } else {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [
    isEnabled,
    continuous,
    interimResults,
    maxAlternatives,
    language,
    handleResult,
    onStart,
    onStop,
    onError,
    onNoMatch,
  ]);

  // Register command handler
  useEffect(
    () =>
      editor.registerCommand(
        SPEECH_TO_TEXT_COMMAND,
        (newIsEnabled: boolean) => {
          setIsEnabled(newIsEnabled);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
    [editor]
  );

  return null;
}

// ============================================================================
// Extension Export
// ============================================================================

/**
 * Speech-to-text extension for Typix editor
 *
 * @example Basic usage
 * ```tsx
 * <TypixRoot>
 *   <SpeechToTextExtension />
 * </TypixRoot>
 * ```
 *
 * @example With custom configuration
 * ```tsx
 * <SpeechToTextExtension
 *   language="es-ES"
 *   voiceCommands={{
 *     "bold": ({ editor }) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
 *   }}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function SpeechToTextExtension(
  props: SpeechToTextExtensionProps
): React.JSX.Element | null {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  if (!isSupported) {
    return null;
  }

  return <SpeechToTextComponent {...props} />;
}

SpeechToTextExtension.displayName = "Typix.SpeechToTextExtension";

// ============================================================================
// Hook
// ============================================================================

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
 * Hook to control speech-to-text functionality
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
  const { lexical } = useTypixEditor();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const start = useCallback(() => {
    setError(null);
    setIsListening(true);
    lexical.dispatchCommand(SPEECH_TO_TEXT_COMMAND, true);
    options?.onListeningChange?.(true);
  }, [lexical, options]);

  const stop = useCallback(() => {
    setIsListening(false);
    lexical.dispatchCommand(SPEECH_TO_TEXT_COMMAND, false);
    options?.onListeningChange?.(false);
  }, [lexical, options]);

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
