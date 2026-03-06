import {
  defineExtension,
  safeCast,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  LexicalEditor,
} from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
  type HeadingTagType,
} from "@typix-editor/core/lexical/rich-text";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
import { defineTypixExtension, TypixExtensionConfig } from "@typix-editor/core";
import { namedSignals } from "@typix-editor/core/lexical/extension";

export interface HeadingConfig extends TypixExtensionConfig {
  levels: Array<1 | 2 | 3 | 4 | 5 | 6>;
  disabled?: boolean;
}

/**
 * HeadingExtension — converts selected blocks to heading nodes.
 *
 * Config lives in the Lexical extension so configExtension() can override it.
 * The merged config is exposed via build() output and flows into commands.
 *
 * @example
 * ```ts
 * // Direct use
 * HeadingExtension({ levels: [1, 2, 3] })
 *
 * // Via configExtension() — e.g. from a MarkdownExtension peer
 * configExtension(HeadingExtension().lexical, { levels: [1, 2] })
 * ```
 */
export const HeadingExtension = (userConfig: Partial<HeadingConfig> = {}) => {
  const resolvedConfig: HeadingConfig = {
    levels: [1, 2, 3, 4, 5, 6],
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/heading",
    config: safeCast<HeadingConfig>(resolvedConfig),
    mergeConfig(a: HeadingConfig, b: Partial<HeadingConfig>): HeadingConfig {
      return { ...a, ...b };
    },
    nodes: () => [HeadingNode],
    // Expose merged config as output so commands can read it
    build(_editor: LexicalEditor, config: HeadingConfig) {
      return namedSignals(config);
    },
  });

  return defineTypixExtension<HeadingConfig>({
    name: "heading",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleHeading: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const level = (attrs as any)?.level as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | undefined;
        if (!level) {
          console.warn(
            "[Typix] toggleHeading requires a level, e.g. toggleHeading({ level: 2 })"
          );
          return false;
        }
        if (!resolvedConfig.levels.includes(level)) {
          console.warn(
            `[Typix] Heading level ${level} is not enabled. Enabled: ${resolvedConfig.levels}`
          );
          return false;
        }
        const tag = `h${level}` as HeadingTagType;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const anchor = selection.anchor.getNode();
          const parent = anchor.getParent();
          const isAlready = $isHeadingNode(parent) && parent.getTag() === tag;
          $setBlocksType(selection, () =>
            isAlready ? $createParagraphNode() : $createHeadingNode(tag)
          );
        });
        return true;
      },

      setHeading: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const level = (attrs as any)?.level as 1 | 2 | 3 | 4 | 5 | 6;
        const tag = `h${level}` as HeadingTagType;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          $setBlocksType(selection, () => $createHeadingNode(tag));
        });
        return true;
      },
    },
    shortcuts: [
      {
        key: "1",
        modifiers: ["mod", "alt"],
        command: "toggleHeading",
        args: { level: 1 },
      },
      {
        key: "2",
        modifiers: ["mod", "alt"],
        command: "toggleHeading",
        args: { level: 2 },
      },
      {
        key: "3",
        modifiers: ["mod", "alt"],
        command: "toggleHeading",
        args: { level: 3 },
      },
    ],
  });
};
