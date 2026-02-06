// Main editor class

// Re-export commands for advanced usage
export * as commands from "./commands";

// Constants and types
export {
  type BlockType,
  DEFAULT_FONT_SIZE,
  ELEMENT_ALIGNMENTS,
  ELEMENT_FORMAT_OPTIONS,
  type ElementAlignment,
  type HeadingLevel,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  TEXT_FORMAT_TYPES,
} from "./constants";
export { TypixEditor } from "./typix-editor";
