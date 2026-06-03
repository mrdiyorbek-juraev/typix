export {
  MarkdownShortcutsExtension,
  type MarkdownShortcutsConfig,
} from "./extension";

// Re-export commonly used transformers for convenience
export {
  TRANSFORMERS,
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  CODE,
  HEADING,
  HIGHLIGHT,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
  type Transformer,
  type ElementTransformer,
  type TextFormatTransformer,
  type TextMatchTransformer,
} from "@typix-editor/core/lexical/markdown";
