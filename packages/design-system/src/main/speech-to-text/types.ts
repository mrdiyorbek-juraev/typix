import type { ReactNode } from "react"

export interface UseSpeechToTextOptions {
  /** Callback when listening state changes. */
  onListeningChange?: (isListening: boolean) => void
}

export interface UseSpeechToTextReturn {
  /** Whether speech recognition is currently active. */
  isListening: boolean
  /** Whether the browser supports speech recognition. */
  isSupported: boolean
  /** Current error, if any. */
  error: Error | null
  /** Last recognized transcript. */
  lastTranscript: string | null
  /** Start speech recognition. */
  start: () => void
  /** Stop speech recognition. */
  stop: () => void
  /** Toggle speech recognition on/off. */
  toggle: () => void
}

export interface SpeechToTextButtonProps {
  /** Additional class name for the button. */
  className?: string
  /** Content to show when listening. Defaults to a pulsing mic icon. */
  listeningContent?: ReactNode
  /** Content to show when idle. Defaults to a mic icon. */
  idleContent?: ReactNode
  /** Content to show when unsupported. Defaults to a mic-off icon. */
  unsupportedContent?: ReactNode
  /** Whether to hide the button when speech is not supported. @default false */
  hideWhenUnsupported?: boolean
  /** Callback when listening state changes. */
  onListeningChange?: (isListening: boolean) => void
}
