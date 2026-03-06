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
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

// ─── Output ─────────────────────────────────────────────────────────────────

/**
 * Runtime state exposed by the CodeBlockExtension.
 * Access via `getCodeBlockOutput(editor)`.
 */
export interface CodeBlockOutput {
  /**
   * The set of Lexical node keys for all CodeNode instances currently in the
   * editor. Reactive — subscribe via your framework adapter to update the UI
   * whenever code blocks are added or removed.
   */
  nodeKeys: Signal<Set<string>>;
}

const _outputByEditor = new WeakMap<LexicalEditor, CodeBlockOutput>();

/**
 * Retrieve the CodeBlockExtension's runtime output for a given editor.
 * Returns `undefined` if the extension is not registered.
 *
 * @example
 * const output = getCodeBlockOutput(editor);
 * const keys = output?.nodeKeys.value; // Set<string>
 */
export function getCodeBlockOutput(
  editor: LexicalEditor
): CodeBlockOutput | undefined {
  return _outputByEditor.get(editor);
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface CodeBlockConfig extends TypixExtensionConfig {
  /**
   * Temporarily disable all code-block commands and mutation tracking.
   * @default false
   */
  disabled?: boolean;

  /**
   * Default language applied when inserting a new code block without an
   * explicit language argument.
   * @default 'javascript'
   */
  defaultLanguage?: string;

  /**
   * Restrict the language selector to a specific list of language keys.
   * When omitted, all Prism-supported languages are available.
   *
   * @example ['javascript', 'typescript', 'python', 'css', 'html']
   */
  languages?: string[];

  /**
   * Called after `copyCode` successfully writes code to the clipboard.
   * @param code    - The plain-text code content that was copied
   * @param nodeKey - Lexical key of the source CodeNode
   */
  onCopy?: (code: string, nodeKey: string) => void;

  /**
   * Called when a code block's language is changed via `setCodeLanguage`.
   * @param language - The new (normalized) language key
   * @param nodeKey  - Lexical key of the CodeNode that was updated
   */
  onLanguageChange?: (language: string, nodeKey: string) => void;
}

// ─── Extension ───────────────────────────────────────────────────────────────

/**
 * CodeBlockExtension — headless code block interactions for Typix.
 *
 * Provides language selection, copy-to-clipboard, and insert/delete commands
 * for Lexical's `CodeNode`. Works alongside `CodeHighlightPrismExtension` or
 * `CodeHighlightShikiExtension` for syntax colouring.
 *
 * ### Commands
 * | command             | attrs                                    |
 * |---------------------|------------------------------------------|
 * | `insertCodeBlock`   | `{ language?: string }`                  |
 * | `setCodeLanguage`   | `{ nodeKey: string; language: string }`  |
 * | `copyCode`          | `{ nodeKey: string }`                    |
 * | `deleteCodeBlock`   | `{ nodeKey: string }`                    |
 *
 * ### Output
 * Access runtime state via `getCodeBlockOutput(editor)`:
 * ```ts
 * const { nodeKeys } = getCodeBlockOutput(editor)!;
 * // nodeKeys.value → Set<string> of all CodeNode keys
 * ```
 *
 * For each key, read the current language:
 * ```ts
 * const language = editor.getEditorState().read(() => {
 *   const node = $getNodeByKey(key);
 *   return $isCodeNode(node) ? node.getLanguage() : null;
 * });
 * ```
 *
 * @example
 * ```ts
 * createTypix({
 *   extensions: [
 *     CodeBlockExtension({
 *       defaultLanguage: 'typescript',
 *       languages: ['javascript', 'typescript', 'python', 'css'],
 *       onCopy: (code) => toast('Copied!'),
 *       onLanguageChange: (lang, key) => console.log(lang, key),
 *     }),
 *   ],
 * })
 *
 * // Insert a code block
 * editor.chain().insertCodeBlock({ language: 'python' }).run()
 *
 * // Change language on an existing node
 * editor.chain().setCodeLanguage({ nodeKey: 'abc', language: 'typescript' }).run()
 *
 * // Copy code
 * editor.chain().copyCode({ nodeKey: 'abc' }).run()
 * ```
 */
export const CodeBlockExtension = (
  userConfig: Partial<CodeBlockConfig> = {}
) => {
  const resolvedConfig: CodeBlockConfig = {
    disabled: false,
    defaultLanguage: "javascript",
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/code-block",

    // Register CodeNode and CodeHighlightNode so the extension is self-contained.
    // When used with code-highlight-prism/shiki, Lexical deduplicates node
    // registrations automatically.
    nodes: () => [CodeNode, CodeHighlightNode],

    config: safeCast<CodeBlockConfig>(resolvedConfig),

    build(editor) {
      const nodeKeys = signal<Set<string>>(new Set());
      const output: CodeBlockOutput = { nodeKeys };
      _outputByEditor.set(editor, output);
      return output;
    },

    

    register(editor, _config, state) {
      if (resolvedConfig.disabled) return () => {};

      const { nodeKeys } = state.getOutput();

      // Track all CodeNode instances so consumers know which nodes to render
      // toolbars for.
      return editor.registerMutationListener(CodeNode, (mutations) => {
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
    },
  });

  return defineTypixExtension({
    name: "code-block",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /**
       * Insert a new code block at the current selection.
       * If the selection is already inside a code block, toggle it back to a
       * paragraph.
       */
      insertCodeBlock: (config) => (ctx, attrs) => {
        if (config.disabled) return false;
        const language =
          (attrs?.language as string | undefined) ??
          config.defaultLanguage ??
          "javascript";

        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor.getNode();
            const topElement = anchor.getTopLevelElementOrThrow();
            const isAlreadyCode = $isCodeNode(topElement);
            $setBlocksType(selection, () =>
              isAlreadyCode
                ? $createParagraphNode()
                : $createCodeNode(language)
            );
          } else {
            // No selection — insert at nearest root
            $insertNodeToNearestRoot($createCodeNode(language));
          }
        });
        return true;
      },

      /**
       * Change the language of an existing code block.
       * `attrs.nodeKey` — Lexical key of the target CodeNode
       * `attrs.language` — new language key (will be normalized)
       */
      setCodeLanguage: (config) => (ctx, attrs) => {
        if (config.disabled) return false;
        const nodeKey = attrs?.nodeKey as string | undefined;
        const language = attrs?.language as string | undefined;
        if (!nodeKey || !language) return false;

        const normalized = normalizeCodeLang(language) || language;
        ctx.editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isCodeNode(node)) {
            node.setLanguage(normalized);
          }
        });
        config.onLanguageChange?.(normalized, nodeKey);
        return true;
      },

      /**
       * Copy the plain-text content of a code block to the clipboard.
       * `attrs.nodeKey` — Lexical key of the target CodeNode
       */
      copyCode: (config) => (ctx, attrs) => {
        if (config.disabled) return false;
        const nodeKey = attrs?.nodeKey as string | undefined;
        if (!nodeKey) return false;

        const code = ctx.editor.getEditorState().read(() => {
          const node = $getNodeByKey(nodeKey);
          return $isCodeNode(node) ? node.getTextContent() : null;
        });

        if (code === null) return false;

        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            config.onCopy?.(code, nodeKey);
          });
        }
        return true;
      },

      /**
       * Remove a code block node from the editor.
       * `attrs.nodeKey` — Lexical key of the CodeNode to delete
       */
      deleteCodeBlock: (config) => (ctx, attrs) => {
        if (config.disabled) return false;
        const nodeKey = attrs?.nodeKey as string | undefined;
        if (!nodeKey) return false;

        ctx.editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isCodeNode(node)) {
            node.remove();
          }
        });
        return true;
      },
    },
    shortcuts: [
      {
        key: "`",
        modifiers: ["mod", "alt"],
        command: "insertCodeBlock",
      },
    ],
  });
};
