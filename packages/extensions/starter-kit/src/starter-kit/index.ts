import { defineExtension } from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionDefinition,
  type TypixExtensionConfig,
  type CommandFunction,
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

export interface StarterKitOptions extends TypixExtensionConfig {
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

/**
 * StarterKit — a batteries-included bundle of the most common Typix extensions,
 * returned as a single `TypixExtensionDefinition`.
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
export const StarterKit = (
  options: StarterKitOptions = {}
): TypixExtensionDefinition<StarterKitOptions> => {
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

  // Build enabled sub-extensions
  const subExts: TypixExtensionDefinition<any>[] = [];

  if (merged.bold !== false) subExts.push(BoldExtension(merged.bold ?? {}));
  if (merged.italic !== false)
    subExts.push(ItalicExtension(merged.italic ?? {}));
  if (merged.underline !== false)
    subExts.push(UnderlineExtension(merged.underline ?? {}));
  if (merged.strike !== false)
    subExts.push(StrikeExtension(merged.strike ?? {}));
  if (merged.subscript !== false)
    subExts.push(SubscriptExtension(merged.subscript ?? {}));
  if (merged.superscript !== false)
    subExts.push(SuperscriptExtension(merged.superscript ?? {}));
  if (merged.highlight !== false)
    subExts.push(HighlightExtension(merged.highlight ?? {}));
  if (merged.heading !== false)
    subExts.push(HeadingExtension(merged.heading ?? {}));
  if (merged.blockquote !== false)
    subExts.push(BlockquoteExtension(merged.blockquote ?? {}));
  if (merged.list !== false) subExts.push(ListExtension(merged.list ?? {}));
  if (merged.code !== false) subExts.push(CodeExtension(merged.code ?? {}));
  if (merged.alignment !== false)
    subExts.push(AlignmentExtension(merged.alignment ?? {}));
  if (merged.link !== false) subExts.push(LinkExtension(merged.link ?? {}));
  if (merged.history !== false)
    subExts.push(HistoryExtension(merged.history ?? {}));
  if (merged.autoLink !== false)
    subExts.push(AutoLinkExtension(merged.autoLink ?? {}));
  if (merged.dragDropPaste !== false)
    subExts.push(DragDropPasteExtension(merged.dragDropPaste ?? {}));
  if (merged.fontSize !== false)
    subExts.push(FontSizeExtension(merged.fontSize ?? {}));
  if (merged.fontFamily !== false)
    subExts.push(FontFamilyExtension(merged.fontFamily ?? {}));
  if (merged.textColor !== false)
    subExts.push(TextColorExtension(merged.textColor ?? {}));
  if (merged.direction !== false)
    subExts.push(DirectionExtension(merged.direction ?? {}));

  // Compose all Lexical extensions into one
  const typix = defineExtension({
    name: "@typix/starter-kit",
    dependencies: subExts.map((e) => e.typix),
  });

  // Merge commands — pre-bind each with its own sub-extension config,
  // then wrap to accept StarterKitOptions (which is ignored at call time)
  const commands: Record<string, CommandFunction<StarterKitOptions>> = {};
  for (const ext of subExts) {
    if (ext.commands) {
      const extConfig = (ext.config ?? {}) as TypixExtensionConfig;
      for (const [name, fn] of Object.entries(ext.commands)) {
        const handler = (fn as CommandFunction<TypixExtensionConfig>)(
          extConfig
        );
        commands[name] = () => handler;
      }
    }
  }

  // Merge shortcuts
  const shortcuts = subExts.flatMap((e) => e.shortcuts ?? []);

  return defineTypixExtension({
    name: "starter-kit",
    typix,
    config: merged,
    commands,
    shortcuts,
  });
};
