import type { LexicalEditor, TextFormatType } from "lexical";
import type { FC } from "react";

/**
 * Re-export LexicalEditor type for direct access to the underlying editor.
 * Use editor.lexical to access this from a TypixEditor instance.
 */
export type { LexicalEditor, TextFormatType };

/**
 * Base type for Typix extensions.
 *
 * Extensions are React function components that integrate with the editor.
 * They typically register Lexical plugins, commands, or UI elements.
 *
 * @template P - Props type for the extension
 *
 * @example
 * ```tsx
 * const MyExtension: TypixExtension<{ maxLength: number }> = ({ maxLength }) => {
 *   const [editor] = useLexicalComposerContext();
 *   // ... register plugins
 *   return null;
 * };
 * MyExtension.displayName = "Typix.MyExtension";
 * ```
 */
export type TypixExtension<P = Record<string, never>> = FC<P> & {
  displayName?: string;
};
