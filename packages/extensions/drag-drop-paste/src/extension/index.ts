import { effect, namedSignals } from "@lexical/extension";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { isMimeType, mediaFileReader } from "@lexical/utils";
import {
  COMMAND_PRIORITY_LOW,
  type CommandListenerPriority,
  createCommand,
  defineExtension,
  safeCast,
} from "lexical";

export interface InsertImagePayload {
  src: string;
  altText?: string;
  width?: number | "inherit";
  height?: number | "inherit";
  maxWidth?: number;
  showCaption?: boolean;
  caption?: string;
  key?: string;
}

export interface DragDropPasteConfig {
  /** Set to true to temporarily disable drag-drop-paste handling. */
  disabled: boolean;
  acceptedTypes?: string[];
  maxFileSize?: number;
  priority?: CommandListenerPriority;
  onFilesAdded?: (files: File[]) => Promise<InsertImagePayload[]>;
  onValidationError?: (file: File, reason: string) => void;
  transformResult?: (file: File, result: string) => InsertImagePayload;
  debug?: boolean;
}

export const INSERT_IMAGE_COMMAND =
  createCommand<InsertImagePayload>("INSERT_IMAGE_COMMAND");

const DEFAULT_ACCEPTED_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(
  file: File,
  acceptedTypes: string[],
  maxFileSize: number
): { valid: boolean; reason?: string } {
  if (!isMimeType(file, acceptedTypes)) {
    return {
      valid: false,
      reason: `Invalid file type: ${file.type}. Accepted types: ${acceptedTypes.join(", ")}`,
    };
  }
  if (file.size > maxFileSize) {
    return {
      valid: false,
      reason: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }
  return { valid: true };
}

export const DragDropPasteExtension = defineExtension({
  name: "@typix/drag-drop-paste",

  config: safeCast<DragDropPasteConfig>({ disabled: false }),

  build(_editor, config) {
    return namedSignals(config);
  },

  register(editor, _config, state) {
    const {
      disabled,
      priority,
      acceptedTypes,
      maxFileSize,
      onFilesAdded,
      onValidationError,
      transformResult,
      debug,
    } = state.getOutput();

    return effect(() => {
      if (disabled.value) return;

      // priority affects registration so read it in the effect body.
      const currentPriority = priority?.value ?? COMMAND_PRIORITY_LOW;

      return editor.registerCommand(
        DRAG_DROP_PASTE,
        (files) => {
          (async () => {
            try {
              // All other config values are read inside the async handler so
              // they're always current without creating effect subscriptions.
              const currentAcceptedTypes =
                acceptedTypes?.value ?? DEFAULT_ACCEPTED_TYPES;
              const currentMaxFileSize =
                maxFileSize?.value ?? DEFAULT_MAX_FILE_SIZE;
              const currentDebug = debug?.value ?? false;

              const log = (...args: unknown[]) => {
                if (currentDebug) console.log("[DragDropPaste]", ...args);
              };

              log("Processing files:", files);

              const validFiles: File[] = [];
              for (const file of files) {
                const validation = validateFile(
                  file,
                  currentAcceptedTypes,
                  currentMaxFileSize
                );
                if (validation.valid) {
                  validFiles.push(file);
                } else {
                  log("Validation failed:", file.name, validation.reason);
                  onValidationError?.value?.(
                    file,
                    validation.reason ?? "Unknown error"
                  );
                }
              }

              if (validFiles.length === 0) {
                log("No valid files to process");
                return;
              }

              log("Valid files:", validFiles.length);

              const currentOnFilesAdded = onFilesAdded?.value;
              if (currentOnFilesAdded) {
                log("Using custom file handler");
                const payloads = await currentOnFilesAdded(validFiles);
                for (const payload of payloads) {
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
                }
                return;
              }

              log("Using default base64 handler");
              const filesResult = await mediaFileReader(
                validFiles,
                currentAcceptedTypes
              );
              for (const { file, result } of filesResult) {
                if (isMimeType(file, currentAcceptedTypes)) {
                  const currentTransformResult = transformResult?.value;
                  const payload: InsertImagePayload = currentTransformResult
                    ? currentTransformResult(file, result)
                    : { src: result, altText: file.name };
                  log("Dispatching INSERT_IMAGE_COMMAND:", payload);
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
                }
              }
            } catch (error) {
              console.error("[DragDropPaste] Error processing files:", error);
              const firstFile = files[0];
              if (firstFile) {
                onValidationError?.value?.(
                  firstFile,
                  error instanceof Error ? error.message : "Unknown error"
                );
              }
            }
          })();
          return true;
        },
        currentPriority
      );
    });
  },
});
