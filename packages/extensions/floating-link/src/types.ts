import type * as React from "react";
import type { ReactNode } from "react";

export type FloatingLinkRenderProps = {
  /** Whether the editor is in editing mode (input visible) */
  isEditing: boolean;
  /** The current link URL (from the link node) */
  linkUrl: string;
  /** The URL being edited in the input */
  editedUrl: string;
  /** Whether the edited URL is valid */
  isValidUrl: boolean;
  /** Update the URL in the input */
  setEditedUrl: (url: string) => void;
  /** Submit the edited URL */
  submitLink: () => void;
  /** Cancel editing and return to view mode */
  cancelEdit: () => void;
  /** Enter edit mode */
  startEdit: () => void;
  /** Remove the link entirely */
  deleteLink: () => void;
  /** Ref for the URL input element (auto-focused when editing) */
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export type FloatingLinkExtensionProps = {
  /** Custom render function. Receives link state and actions, replaces the default UI entirely. */
  children?: (props: FloatingLinkRenderProps) => ReactNode;
  /** Vertical offset in px for positioning the floating element below the link (default: 40) */
  verticalOffset?: number;
};
