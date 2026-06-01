import {
  defineExtension,
  safeCast,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
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
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface CodeConfig {
  /** Default language for new code blocks */
  defaultLanguage: string;
  disabled?: boolean;
}

export const TYPIX_TOGGLE_INLINE_CODE = createCommand<void>(
  "TYPIX_TOGGLE_INLINE_CODE"
);
export const TYPIX_TOGGLE_CODE_BLOCK = createCommand<{
  language?: string;
} | void>("TYPIX_TOGGLE_CODE_BLOCK");

export const CodeExtension = defineExtension({
  name: "@typix/code",
  config: safeCast<CodeConfig>({ defaultLanguage: "javascript", disabled: false }),
  mergeConfig(a: CodeConfig, b: Partial<CodeConfig>): CodeConfig {
    return { ...a, ...b };
  },
  nodes: () => [CodeNode, CodeHighlightNode],
  build(_editor: LexicalEditor, config: CodeConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: CodeConfig, state: any) {
    const { disabled, defaultLanguage } = state.getOutput();
    return effect(() => {
      if (disabled.value) return;
      const d0 = registerCodeHighlighting(editor);
      const d1 = editor.registerCommand(
        TYPIX_TOGGLE_INLINE_CODE,
        () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      const d2 = editor.registerCommand(
        TYPIX_TOGGLE_CODE_BLOCK,
        (payload) => {
          const language =
            payload?.language ?? defaultLanguage?.value ?? "javascript";
          editor.update(() => {
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
        COMMAND_PRIORITY_EDITOR
      );
      return () => {
        d0();
        d1();
        d2();
      };
    });
  },
});

registerTypixMeta(CodeExtension, {
  commands: {
    toggleInlineCode: TYPIX_TOGGLE_INLINE_CODE,
    toggleCodeBlock: TYPIX_TOGGLE_CODE_BLOCK,
  },
  shortcuts: [
    { key: "`", modifiers: ["mod"], command: "toggleInlineCode" },
    { key: "`", modifiers: ["mod", "alt"], command: "toggleCodeBlock" },
  ],
});


declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleInlineCode(): R;
    toggleCodeBlock(attrs?: { language?: string }): R;
  }
}
