import type { ElementFormatType, TextFormatType } from "lexical";

// ============================================
// TEXT FORMAT
// ============================================

/**
 * All available text format types
 */
export const TEXT_FORMAT_TYPES: TextFormatType[] = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "subscript",
  "superscript",
  "highlight",
  "lowercase",
  "uppercase",
];

// ============================================
// BLOCK TYPES
// ============================================

/**
 * Valid heading levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Block types for isActive checks
 */
export type BlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "bullet"
  | "number"
  | "check"
  | "quote"
  | "code";

// ============================================
// FONT SIZE
// ============================================

/**
 * Font size constraints
 */
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 144;
export const DEFAULT_FONT_SIZE = 16;

// ============================================
// ELEMENT ALIGNMENT
// ============================================

/**
 * Element alignment type (excludes empty string)
 */
export type ElementAlignment = Exclude<ElementFormatType, "">;

/**
 * All available element alignment types
 */
export const ELEMENT_ALIGNMENTS: ElementAlignment[] = [
  "left",
  "center",
  "right",
  "justify",
  "start",
  "end",
];

/**
 * Element format options with icon and display name information.
 * Useful for building alignment toolbars and menus.
 */
export const ELEMENT_FORMAT_OPTIONS: {
  [key in ElementAlignment]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: "center-align",
    iconRTL: "center-align",
    name: "Center Align",
  },
  end: {
    icon: "right-align",
    iconRTL: "left-align",
    name: "End Align",
  },
  justify: {
    icon: "justify-align",
    iconRTL: "justify-align",
    name: "Justify Align",
  },
  left: {
    icon: "left-align",
    iconRTL: "left-align",
    name: "Left Align",
  },
  right: {
    icon: "right-align",
    iconRTL: "right-align",
    name: "Right Align",
  },
  start: {
    icon: "left-align",
    iconRTL: "right-align",
    name: "Start Align",
  },
};
