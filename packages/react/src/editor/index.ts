// Main editor class
export { TypixEditor } from "./typix-editor";

// Constants and types
export {
  type BlockType,
  DEFAULT_FONT_SIZE,
  type ElementAlignment,
  ELEMENT_ALIGNMENTS,
  ELEMENT_FORMAT_OPTIONS,
  type HeadingLevel,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  TEXT_FORMAT_TYPES,
} from "./constants";

// Re-export commands for advanced usage
export * as commands from "./commands";
