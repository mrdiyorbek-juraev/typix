import { defineExtension } from "lexical";
import {
  registerTypixMeta,
  mergeTypixMeta,
  configExtension,
  type AnyLexicalExtension,
} from "@typix-editor/core";
import { BoldExtension, type BoldConfig } from "../extensions/bold";
import { ItalicExtension, type ItalicConfig } from "../extensions/italic";
import {
  UnderlineExtension,
  type UnderlineConfig,
} from "../extensions/underline";
import { StrikeExtension, type StrikeConfig } from "../extensions/strike";
import {
  SubscriptExtension,
  type SubscriptConfig,
} from "../extensions/subscript";
import {
  SuperscriptExtension,
  type SuperscriptConfig,
} from "../extensions/superscript";
import {
  HighlightExtension,
  type HighlightConfig,
} from "../extensions/highlight";
import { HeadingExtension, type HeadingConfig } from "../extensions/heading";
import {
  BlockquoteExtension,
  type BlockquoteConfig,
} from "../extensions/blockquote";
import { ListExtension, type ListConfig } from "../extensions/list";
import { CodeExtension, type CodeConfig } from "../extensions/code";
import {
  AlignmentExtension,
  type AlignmentConfig,
} from "../extensions/alignment";
import { LinkExtension, type LinkConfig } from "../extensions/link";
import { HistoryExtension, type HistoryConfig } from "../extensions/history";
import {
  AutoLinkExtension,
  type AutoLinkConfig,
} from "../extensions/auto-link";
import {
  DragDropPasteExtension,
  type DragDropPasteConfig,
} from "../extensions/drag-drop-paste";
import {
  FontSizeExtension,
  type FontSizeConfig,
} from "../extensions/font-size";
import {
  FontFamilyExtension,
  type FontFamilyConfig,
} from "../extensions/font-family";
import {
  TextColorExtension,
  type TextColorConfig,
} from "../extensions/text-color";
import {
  DirectionExtension,
  type DirectionConfig,
} from "../extensions/direction";

export interface StarterKitOptions {
  /**
   * Convenience preset that configures a sensible set of extensions.
   * Individual options take precedence over the preset.
   *
   * - `"minimal"` — bold, italic, heading (h1–h3), history
   * - `"blog"` — bold, italic, underline, strike, heading (h1–h3),
   *              blockquote, list, link, autoLink, history
   * - `"full"` — all extensions (same as omitting this option)
   */
  preset?: "minimal" | "blog" | "full";

  bold?: false | Partial<BoldConfig>;
  italic?: false | Partial<ItalicConfig>;
  underline?: false | Partial<UnderlineConfig>;
  strike?: false | Partial<StrikeConfig>;
  subscript?: false | Partial<SubscriptConfig>;
  superscript?: false | Partial<SuperscriptConfig>;
  highlight?: false | Partial<HighlightConfig>;
  heading?: false | Partial<HeadingConfig>;
  blockquote?: false | Partial<BlockquoteConfig>;
  list?: false | Partial<ListConfig>;
  code?: false | Partial<CodeConfig>;
  alignment?: false | Partial<AlignmentConfig>;
  link?: false | Partial<LinkConfig>;
  history?: false | Partial<HistoryConfig>;
  autoLink?: false | Partial<AutoLinkConfig>;
  dragDropPaste?: false | Partial<DragDropPasteConfig>;
  fontSize?: false | Partial<FontSizeConfig>;
  fontFamily?: false | Partial<FontFamilyConfig>;
  textColor?: false | Partial<TextColorConfig>;
  direction?: false | Partial<DirectionConfig>;
}

// ─── Preset defaults ─────────────────────────────────────────────────────────

type PresetDefaults = Omit<StarterKitOptions, "preset">;

const PRESET_MINIMAL: PresetDefaults = {
  subscript: false,
  superscript: false,
  highlight: false,
  blockquote: false,
  list: false,
  code: false,
  alignment: false,
  link: false,
  autoLink: false,
  dragDropPaste: false,
  fontSize: false,
  fontFamily: false,
  textColor: false,
  direction: false,
  strike: false,
  underline: false,
};

const PRESET_BLOG: PresetDefaults = {
  subscript: false,
  superscript: false,
  highlight: false,
  code: false,
  alignment: false,
  autoLink: false,
  dragDropPaste: false,
  fontSize: false,
  fontFamily: false,
  textColor: false,
  direction: false,
};

type ExtOrTuple = AnyLexicalExtension | [AnyLexicalExtension, ...unknown[]];

function withConfig<C extends object>(
  ext: AnyLexicalExtension,
  cfg: Partial<C> | undefined
): ExtOrTuple {
  return cfg && Object.keys(cfg).length > 0
    ? configExtension(ext, cfg)
    : ext;
}

/**
 * StarterKit — a batteries-included bundle of the most common Typix extensions,
 * returned as a single native Lexical extension with merged Typix metadata.
 *
 * Pass `false` to disable an extension, or an options object to configure it.
 *
 * @example
 * ```ts
 * // All defaults
 * extensions={[StarterKit()]}
 *
 * // Custom heading levels, no subscript/superscript
 * extensions={[StarterKit({
 *   heading:     { levels: [1, 2, 3] },
 *   subscript:   false,
 *   superscript: false,
 * })]}
 * ```
 */
export const StarterKit = (options: StarterKitOptions = {}) => {
  // Apply preset defaults, then let explicit options override them
  const { preset, ...rest } = options;
  const presetDefaults: PresetDefaults =
    preset === "minimal"
      ? PRESET_MINIMAL
      : preset === "blog"
        ? PRESET_BLOG
        : {};

  // Merge: preset first (lowest priority), explicit options win
  const merged: StarterKitOptions = { ...presetDefaults, ...rest };

  // Build enabled sub-extensions (all are native Lexical extensions now)
  const subExts: ExtOrTuple[] = [];

  if (merged.bold !== false) subExts.push(withConfig(BoldExtension, merged.bold));
  if (merged.italic !== false) subExts.push(withConfig(ItalicExtension, merged.italic));
  if (merged.underline !== false) subExts.push(withConfig(UnderlineExtension, merged.underline));
  if (merged.strike !== false) subExts.push(withConfig(StrikeExtension, merged.strike));
  if (merged.subscript !== false) subExts.push(withConfig(SubscriptExtension, merged.subscript));
  if (merged.superscript !== false) subExts.push(withConfig(SuperscriptExtension, merged.superscript));
  if (merged.highlight !== false) subExts.push(withConfig(HighlightExtension, merged.highlight));
  if (merged.heading !== false) subExts.push(withConfig(HeadingExtension, merged.heading));
  if (merged.blockquote !== false) subExts.push(withConfig(BlockquoteExtension, merged.blockquote));
  if (merged.list !== false) subExts.push(withConfig(ListExtension, merged.list));
  if (merged.code !== false) subExts.push(withConfig(CodeExtension, merged.code));
  if (merged.alignment !== false) subExts.push(withConfig(AlignmentExtension, merged.alignment));
  if (merged.link !== false) subExts.push(withConfig(LinkExtension, merged.link));
  if (merged.history !== false) subExts.push(withConfig(HistoryExtension, merged.history));
  if (merged.autoLink !== false) subExts.push(withConfig(AutoLinkExtension, merged.autoLink));
  if (merged.dragDropPaste !== false) subExts.push(withConfig(DragDropPasteExtension, merged.dragDropPaste));
  if (merged.fontSize !== false) subExts.push(withConfig(FontSizeExtension, merged.fontSize));
  if (merged.fontFamily !== false) subExts.push(withConfig(FontFamilyExtension, merged.fontFamily));
  if (merged.textColor !== false) subExts.push(withConfig(TextColorExtension, merged.textColor));
  if (merged.direction !== false) subExts.push(withConfig(DirectionExtension, merged.direction));

  // Compose all Lexical extensions into one
  const lexicalExt = defineExtension({
    name: "@typix/starter-kit",
    dependencies: subExts as AnyLexicalExtension[],
  });

  // Merge all sub-extension metadata (commands + shortcuts) into StarterKit
  registerTypixMeta(lexicalExt, mergeTypixMeta(subExts));

  return lexicalExt;
};
