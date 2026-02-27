import type { LexicalEditor, TextFormatType } from "lexical";
import type { FC } from "react";

/**
 * Re-export LexicalEditor type for direct access to the underlying editor.
 * Use editor.lexical to access this from a TypixEditor instance.
 */
export type { LexicalEditor, TextFormatType };

/**
 * @deprecated Use `defineExtension` from `lexical` to define framework-agnostic
 * extensions instead of React function components.
 *
 * @template P - Props type for the extension
 */
export type TypixExtension<P = Record<string, never>> = FC<P> & {
  displayName?: string;
};
