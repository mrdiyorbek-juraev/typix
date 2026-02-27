import type { LexicalEditor, RangeSelection } from "lexical";

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

export interface SpeechToTextConfig {
  /** Set to true to temporarily disable the speech-to-text behavior. */
  disabled: boolean;

  /**
   * Language for speech recognition (BCP-47 language tag)
   * @default "en-US"
   */
  language: string;

  /**
   * Whether to continuously listen or stop after first result
   * @default true
   */
  continuous: boolean;

  /**
   * Whether to return interim (partial) results
   * @default true
   */
  interimResults: boolean;

  /**
   * Maximum alternatives for each result
   * @default 1
   */
  maxAlternatives: number;

  /**
   * Custom voice commands to extend or override defaults
   * Keys are lowercase command phrases, values are handler functions
   */
  voiceCommands: VoiceCommands;

  /**
   * Whether to include default voice commands (undo, redo, new line)
   * @default true
   */
  includeDefaultCommands: boolean;

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
   */
  processTranscript?: (transcript: string) => string | null;
}

/** @deprecated Use SpeechToTextConfig */
export type SpeechToTextExtensionProps = Partial<
  Omit<SpeechToTextConfig, "disabled">
>;
