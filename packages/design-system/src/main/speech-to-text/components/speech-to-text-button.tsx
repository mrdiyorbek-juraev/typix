import type { JSX } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../primitives/tooltip";
import { useSpeechToText } from "../hooks/use-speech-to-text";
import type { SpeechToTextButtonProps } from "../types";

/**
 * Pre-built speech-to-text toggle button with shadcn styling.
 *
 * @example
 * ```tsx
 * <EditorRoot config={config}>
 *   <EditorContent />
 *   <Toolbar>
 *     <SpeechToTextButton />
 *   </Toolbar>
 * </EditorRoot>
 * ```
 */
export function SpeechToTextButton({
  className,
  listeningContent,
  idleContent,
  unsupportedContent,
  hideWhenUnsupported = false,
  onListeningChange,
}: SpeechToTextButtonProps): JSX.Element | null {
  const { isListening, isSupported, toggle } = useSpeechToText({
    onListeningChange,
  });

  if (!isSupported) {
    if (hideWhenUnsupported) return null;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled
            className={cn("size-8 text-muted-foreground", className)}
          >
            {unsupportedContent ?? <MicOff className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Speech recognition is not supported in this browser</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            "size-8 transition-colors duration-150",
            isListening
              ? "text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              : "text-muted-foreground hover:text-foreground",
            className
          )}
        >
          {isListening
            ? (listeningContent ?? (
                <span className="relative flex items-center justify-center">
                  <span className="absolute size-4 animate-ping rounded-full bg-destructive/30" />
                  <Mic className="relative size-4" />
                </span>
              ))
            : (idleContent ?? <Mic className="size-4" />)}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isListening ? "Stop listening" : "Start voice input"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

SpeechToTextButton.displayName = "Typix.SpeechToTextButton";
