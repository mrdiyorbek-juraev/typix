import { signal, type Signal } from "@typix-editor/core/lexical/extension";
import {
  $createCodeNode,
  $isCodeNode,
  CodeHighlightNode,
  CodeNode,
  normalizeCodeLang,
} from "@typix-editor/core/lexical/code";
import { $setBlocksType } from "@typix-editor/core/lexical/selection";
import { $insertNodeToNearestRoot } from "@typix-editor/core/lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import { registerTypixMeta, registerExtensionOutput } from "@typix-editor/core";

// ─── Output ─────────────────────────────────────────────────────────────────

export interface CodeBlockOutput {
  nodeKeys: Signal<Set<string>>;
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface CodeBlockConfig {
  disabled?: boolean;
  defaultLanguage?: string;
  languages?: string[];
  onCopy?: (code: string, nodeKey: string) => void;
  onLanguageChange?: (language: string, nodeKey: string) => void;
}

// ─── Commands ────────────────────────────────────────────────────────────────

export const TYPIX_INSERT_CODE_BLOCK = createCommand<{
  language?: string;
} | void>("TYPIX_INSERT_CODE_BLOCK");

export const TYPIX_SET_CODE_LANGUAGE = createCommand<{
  nodeKey: string;
  language: string;
}>("TYPIX_SET_CODE_LANGUAGE");

export const TYPIX_COPY_CODE = createCommand<{ nodeKey: string }>(
  "TYPIX_COPY_CODE"
);

export const TYPIX_DELETE_CODE_BLOCK = createCommand<{ nodeKey: string }>(
  "TYPIX_DELETE_CODE_BLOCK"
);

// ─── Extension ───────────────────────────────────────────────────────────────

export const CodeBlockExtension = defineExtension({
  name: "@typix/code-block",

  nodes: () => [CodeNode, CodeHighlightNode],

  config: safeCast<CodeBlockConfig>({
    disabled: false,
    defaultLanguage: "javascript",
  }),

  mergeConfig(
    a: CodeBlockConfig,
    b: Partial<CodeBlockConfig>
  ): CodeBlockConfig {
    return { ...a, ...b };
  },

  build(editor: LexicalEditor) {
    const nodeKeys = signal<Set<string>>(new Set());
    const output: CodeBlockOutput = { nodeKeys };
    registerExtensionOutput(editor, CodeBlockExtension, output);
    return output;
  },

  register(editor: LexicalEditor, _config: CodeBlockConfig, state: any) {
    if (_config.disabled) return () => {};

    const { nodeKeys } = state.getOutput();

    const d0 = editor.registerMutationListener(CodeNode, (mutations) => {
      const keys = new Set(nodeKeys.value);
      let changed = false;

      for (const [key, mutation] of mutations) {
        if (mutation === "created") {
          keys.add(key);
          changed = true;
        } else if (mutation === "destroyed") {
          keys.delete(key);
          changed = true;
        }
      }

      if (changed) {
        nodeKeys.value = keys;
      }
    });

    const d1 = editor.registerCommand(
      TYPIX_INSERT_CODE_BLOCK,
      (payload) => {
        const language =
          payload?.language ?? _config.defaultLanguage ?? "javascript";
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor.getNode();
            const topElement = anchor.getTopLevelElementOrThrow();
            const isAlreadyCode = $isCodeNode(topElement);
            $setBlocksType(selection, () =>
              isAlreadyCode ? $createParagraphNode() : $createCodeNode(language)
            );
          } else {
            $insertNodeToNearestRoot($createCodeNode(language));
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    const d2 = editor.registerCommand(
      TYPIX_SET_CODE_LANGUAGE,
      ({ nodeKey, language }) => {
        const normalized = normalizeCodeLang(language) || language;
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isCodeNode(node)) {
            node.setLanguage(normalized);
          }
        });
        _config.onLanguageChange?.(normalized, nodeKey);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    const d3 = editor.registerCommand(
      TYPIX_COPY_CODE,
      ({ nodeKey }) => {
        const code = editor.getEditorState().read(() => {
          const node = $getNodeByKey(nodeKey);
          return $isCodeNode(node) ? node.getTextContent() : null;
        });
        if (code === null) return false;
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            _config.onCopy?.(code, nodeKey);
          });
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    const d4 = editor.registerCommand(
      TYPIX_DELETE_CODE_BLOCK,
      ({ nodeKey }) => {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isCodeNode(node)) {
            node.remove();
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      d0();
      d1();
      d2();
      d3();
      d4();
    };
  },
});

registerTypixMeta(CodeBlockExtension, {
  commands: {
    insertCodeBlock: TYPIX_INSERT_CODE_BLOCK,
    setCodeLanguage: TYPIX_SET_CODE_LANGUAGE,
    copyCode: TYPIX_COPY_CODE,
    deleteCodeBlock: TYPIX_DELETE_CODE_BLOCK,
  },
  shortcuts: [
    {
      key: "`",
      modifiers: ["mod", "alt"],
      command: "insertCodeBlock",
    },
  ],
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    insertCodeBlock(attrs?: { language?: string }): R;
    setCodeLanguage(attrs: { nodeKey: string; language: string }): R;
    copyCode(attrs: { nodeKey: string }): R;
    deleteCodeBlock(attrs: { nodeKey: string }): R;
  }
}
