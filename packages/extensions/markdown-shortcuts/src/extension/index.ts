import { defineExtension, safeCast, type LexicalEditor } from "lexical";
import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import {
  registerMarkdownShortcuts,
  TRANSFORMERS,
  type Transformer,
} from "@typix-editor/core/lexical/markdown";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MarkdownShortcutsConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable all markdown shortcuts. */
  disabled: boolean;
  /**
   * Markdown transformers to register.
   * Defaults to the full built-in `TRANSFORMERS` list from `@lexical/markdown`.
   *
   * You can pass a subset of built-in transformers or mix in custom ones:
   * @example
   * ```ts
   * import { HEADING, BOLD_STAR, ITALIC_STAR, CODE_BLOCK } from "@typix-editor/core/lexical/markdown";
   *
   * MarkdownShortcutsExtension({ transformers: [HEADING, BOLD_STAR, ITALIC_STAR, CODE_BLOCK] })
   * ```
   */
  transformers: Transformer[];
}

// ─── Extension ──────────────────────────────────────────────────────────────

/**
 * MarkdownShortcutsExtension — converts markdown syntax to rich text as you type.
 *
 * Examples of what this enables:
 * - `# ` → Heading 1
 * - `## ` → Heading 2
 * - `> ` → Blockquote
 * - `- ` or `* ` → Unordered list
 * - `1. ` → Ordered list
 * - `- [ ] ` → Check list
 * - ` ``` ` → Code block
 * - `**text**` → Bold
 * - `*text*` → Italic
 * - `~~text~~` → Strikethrough
 * - `` `code` `` → Inline code
 *
 * @example
 * ```ts
 * // All built-in transformers (default)
 * extensions={[MarkdownShortcutsExtension()]}
 *
 * // Only specific transformers
 * import { HEADING, BOLD_STAR, ITALIC_STAR } from "@typix-editor/core/lexical/markdown";
 * extensions={[MarkdownShortcutsExtension({ transformers: [HEADING, BOLD_STAR, ITALIC_STAR] })]}
 * ```
 */
export const MarkdownShortcutsExtension = (
  userConfig: Partial<MarkdownShortcutsConfig> = {}
) => {
  const resolvedConfig: MarkdownShortcutsConfig = {
    disabled: false,
    transformers: TRANSFORMERS,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/markdown-shortcuts",

    config: safeCast<MarkdownShortcutsConfig>(resolvedConfig),

    mergeConfig(
      a: MarkdownShortcutsConfig,
      b: Partial<MarkdownShortcutsConfig>
    ): MarkdownShortcutsConfig {
      return { ...a, ...b };
    },

    build(_editor: LexicalEditor, config: MarkdownShortcutsConfig) {
      return namedSignals(config);
    },

    register(editor: LexicalEditor, _config: MarkdownShortcutsConfig, state: any) {
      const { disabled, transformers } = state.getOutput();

      return effect(() => {
        if (disabled?.value) return;

        const activeTransformers: Transformer[] =
          transformers?.value ?? TRANSFORMERS;

        return registerMarkdownShortcuts(editor, activeTransformers);
      });
    },
  });

  return defineTypixExtension<MarkdownShortcutsConfig>({
    name: "markdown-shortcuts",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
