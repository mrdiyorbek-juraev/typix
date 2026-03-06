import {
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  type LexicalEditor,
} from "lexical";
import {
  CodeNode,
  CodeHighlightNode,
  registerCodeHighlighting,
  $createCodeNode,
  $isCodeNode,
} from "@typix-editor/core/lexical/code";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface CodeConfig extends TypixExtensionConfig {
  /** Default language for new code blocks */
  defaultLanguage: string;
  disabled?: boolean;
}

/**
 * CodeExtension — inline code formatting and fenced code blocks.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [CodeExtension({ defaultLanguage: 'typescript' })] })
 *
 * editor.chain().toggleInlineCode().run()
 * editor.chain().toggleCodeBlock({ language: 'typescript' }).run()
 * ```
 */
export const CodeExtension = (userConfig: Partial<CodeConfig> = {}) => {
  const resolvedConfig: CodeConfig = {
    defaultLanguage: "javascript",
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/code",
    config: safeCast<CodeConfig>(resolvedConfig),
    mergeConfig(a: CodeConfig, b: Partial<CodeConfig>): CodeConfig {
      return { ...a, ...b };
    },
    nodes: () => [CodeNode, CodeHighlightNode],
    build(_editor: LexicalEditor, config: CodeConfig, state: any) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: CodeConfig, state: any) {
      const { disabled } = state.getOutput();
      return effect(() => {
        if (disabled.value) return;
        return registerCodeHighlighting(editor);
      });
    },
  });

  return defineTypixExtension<CodeConfig>({
    name: "code",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleInlineCode: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        return true;
      },

      toggleCodeBlock: (resolvedConfig) => (ctx, attrs) => {
        if (resolvedConfig.disabled) return false;
        const language =
          (attrs?.language as string) ?? resolvedConfig.defaultLanguage;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const anchor = selection.anchor.getNode();
          const parent = anchor.getParent();
          const isAlready = $isCodeNode(parent);
          $setBlocksType(selection, () =>
            isAlready ? $createParagraphNode() : $createCodeNode(language)
          );
        });
        return true;
      },
    },
    shortcuts: [
      { key: "`", modifiers: ["mod"], command: "toggleInlineCode" },
      { key: "`", modifiers: ["mod", "alt"], command: "toggleCodeBlock" },
    ],
  });
};
