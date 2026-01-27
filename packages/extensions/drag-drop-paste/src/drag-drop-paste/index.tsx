import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { isMimeType, mediaFileReader } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, type CommandListenerPriority, type LexicalCommand, createCommand } from 'lexical';
import { useEffect } from 'react';

// ========== Types ==========

export interface InsertImagePayload {
    src: string;
    altText?: string;
    width?: number | 'inherit';
    height?: number | 'inherit';
    maxWidth?: number;
    showCaption?: boolean;
    caption?: string;
    key?: string;
}

export interface DragDropPasteExtensionProps {
    /**
     * Accepted image MIME types
     * @default ['image/', 'image/heic', 'image/heif', 'image/gif', 'image/webp']
     */
    acceptedTypes?: string[];

    /**
     * Maximum file size in bytes
     * @default 10 * 1024 * 1024 (10MB)
     */
    maxFileSize?: number;

    /**
     * Command priority
     * @default COMMAND_PRIORITY_LOW
     */
    priority?: CommandListenerPriority;

    /**
     * Custom file handler for advanced use cases (e.g., upload to CDN)
     * If provided, will be called instead of direct base64 insertion
     * 
     * @example
     * ```ts
     * onFilesAdded={async (files) => {
     *   const urls = await uploadToS3(files);
     *   return urls.map(url => ({ src: url }));
     * }}
     * ```
     */
    onFilesAdded?: (files: File[]) => Promise<InsertImagePayload[]>;

    /**
     * Callback when file validation fails
     */
    onValidationError?: (file: File, reason: string) => void;

    /**
     * Transform result before dispatching command
     */
    transformResult?: (file: File, result: string) => InsertImagePayload;

    /**
     * Enable debug logging
     * @default false
     */
    debug?: boolean;
}

// ========== Constants ==========

export const INSERT_IMAGE_COMMAND =
    createCommand('INSERT_IMAGE_COMMAND');

const DEFAULT_ACCEPTED_TYPES = [
    'image/',
    'image/heic',
    'image/heif',
    'image/gif',
    'image/webp',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
];

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ========== Validation ==========

function validateFile(
    file: File,
    acceptedTypes: string[],
    maxFileSize: number
): { valid: boolean; reason?: string } {
    // Check MIME type
    if (!isMimeType(file, acceptedTypes)) {
        return {
            valid: false,
            reason: `Invalid file type: ${file.type}. Accepted types: ${acceptedTypes.join(', ')}`,
        };
    }

    // Check file size
    if (file.size > maxFileSize) {
        return {
            valid: false,
            reason: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`,
        };
    }

    return { valid: true };
}

// ========== Component ==========

/**
 * DragDropPasteExtension
 * 
 * Handles drag-and-drop and paste operations for images in Lexical editor.
 * 
 * Features:
 * - File type validation
 * - File size limits
 * - Custom upload handlers
 * - Error callbacks
 * - Result transformation
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <LexicalComposer>
 *   <DragDropPasteExtension />
 * </LexicalComposer>
 * ```
 * 
 * @example
 * With custom upload:
 * ```tsx
 * <DragDropPasteExtension
 *   acceptedTypes={['image/png', 'image/jpeg']}
 *   maxFileSize={5 * 1024 * 1024}
 *   onFilesAdded={async (files) => {
 *     const uploadedUrls = await uploadToCloudinary(files);
 *     return uploadedUrls.map(url => ({ src: url }));
 *   }}
 *   onValidationError={(file, reason) => {
 *     toast.error(reason);
 *   }}
 * />
 * ```
 * 
 * @example
 * With transformation:
 * ```tsx
 * <DragDropPasteExtension
 *   transformResult={(file, base64) => ({
 *     src: base64,
 *     altText: file.name,
 *     maxWidth: 800,
 *     showCaption: true,
 *   })}
 * />
 * ```
 */
export function DragDropPasteExtension({
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    priority = COMMAND_PRIORITY_LOW,
    onFilesAdded,
    onValidationError,
    transformResult,
    debug = false,
}: DragDropPasteExtensionProps = {}): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const log = (...args: unknown[]) => {
            if (debug) {
                console.log('[DragDropPaste]', ...args);
            }
        };

        return editor.registerCommand(
            DRAG_DROP_PASTE,
            (files) => {
                (async () => {
                    try {
                        log('Processing files:', files);

                        // Validate files first
                        const validFiles: File[] = [];
                        for (const file of files) {
                            const validation = validateFile(file, acceptedTypes, maxFileSize);
                            if (validation.valid) {
                                validFiles.push(file);
                            } else {
                                log('Validation failed:', file.name, validation.reason);
                                onValidationError?.(file, validation.reason || 'Unknown error');
                            }
                        }

                        if (validFiles.length === 0) {
                            log('No valid files to process');
                            return;
                        }

                        log('Valid files:', validFiles.length);

                        // Use custom handler if provided
                        if (onFilesAdded) {
                            log('Using custom file handler');
                            const payloads = await onFilesAdded(validFiles);

                            for (const payload of payloads) {
                                editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
                            }
                            return;
                        }

                        // Default: Convert to base64
                        log('Using default base64 handler');
                        const filesResult = await mediaFileReader(
                            validFiles,
                            acceptedTypes
                        );

                        for (const { file, result } of filesResult) {
                            if (isMimeType(file, acceptedTypes)) {
                                const payload: InsertImagePayload = transformResult
                                    ? transformResult(file, result)
                                    : {
                                        src: result,
                                        altText: file.name,
                                    };

                                log('Dispatching INSERT_IMAGE_COMMAND:', payload);
                                editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
                            }
                        }
                    } catch (error) {
                        console.error('[DragDropPaste] Error processing files:', error);
                        const firstFile = files[0];
                        if (firstFile) {
                            onValidationError?.(
                                firstFile,
                                error instanceof Error ? error.message : 'Unknown error'
                            );
                        }
                    }
                })();
                return true;
            },
            priority
        );
    }, [
        editor,
        acceptedTypes,
        maxFileSize,
        priority,
        onFilesAdded,
        onValidationError,
        transformResult,
        debug,
    ]);

    return null;
}

DragDropPasteExtension.displayName = 'Typix.DragDropPasteExtension';

export default DragDropPasteExtension;