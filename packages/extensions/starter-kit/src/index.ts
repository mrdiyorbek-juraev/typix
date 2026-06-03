// StarterKit bundle
export { StarterKit, type StarterKitOptions } from "./starter-kit";

// Individual extensions (for tree-shaking / selective use)
export { BoldExtension, type BoldConfig } from "./extensions/bold";
export { ItalicExtension, type ItalicConfig } from "./extensions/italic";
export {
  UnderlineExtension,
  type UnderlineConfig,
} from "./extensions/underline";
export { StrikeExtension, type StrikeConfig } from "./extensions/strike";
export {
  SubscriptExtension,
  type SubscriptConfig,
} from "./extensions/subscript";
export {
  SuperscriptExtension,
  type SuperscriptConfig,
} from "./extensions/superscript";
export {
  HighlightExtension,
  type HighlightConfig,
} from "./extensions/highlight";
export { HeadingExtension, type HeadingConfig } from "./extensions/heading";
export {
  BlockquoteExtension,
  type BlockquoteConfig,
} from "./extensions/blockquote";
export { ListExtension, type ListConfig } from "./extensions/list";
export { CodeExtension, type CodeConfig } from "./extensions/code";
export {
  AlignmentExtension,
  type AlignmentConfig,
  type AlignmentValue,
} from "./extensions/alignment";
export { LinkExtension, type LinkConfig } from "./extensions/link";
export { HistoryExtension, type HistoryConfig } from "./extensions/history";
export {
  FontSizeExtension,
  type FontSizeConfig,
  type FontSizeState,
  getFontSizeState,
} from "./extensions/font-size";
export {
  FontFamilyExtension,
  type FontFamilyConfig,
  type FontFamilyState,
  getFontFamilyState,
} from "./extensions/font-family";
export {
  TextColorExtension,
  type TextColorConfig,
} from "./extensions/text-color";
export {
  DirectionExtension,
  type DirectionConfig,
  type DirectionValue,
  type DirectionState,
  getDirectionState,
} from "./extensions/direction";
