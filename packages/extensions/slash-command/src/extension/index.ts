import { signal } from "@typix-editor/core/lexical/extension";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $isElementNode,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import {
  defineTypixExtension,
} from "@typix-editor/core";
import type { SlashCommandConfig, SlashCommandOutput } from "../types";

// ─── Output store ────────────────────────────────────────────────────────────

const _outputByEditor = new WeakMap<LexicalEditor, SlashCommandOutput>();

export function getSlashCommandOutput(
  editor: LexicalEditor
): SlashCommandOutput | undefined {
  return _outputByEditor.get(editor);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the slash query (text after trigger) if the cursor is positioned
 * right after the trigger at the start of a block, otherwise null.
 */
function getSlashQuery(trigger: string): { query: string } | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;

  const anchor = selection.anchor;
  if (anchor.type !== "text") return null;

  // FIX: early-exit before any string allocation when cursor is too close to
  // start or the first character clearly isn't the trigger
  if (anchor.offset < trigger.length) return null;

  const node = anchor.getNode();
  if (!$isTextNode(node)) return null;

  const text = node.getTextContent();
  // Fast char check before slicing — avoids string alloc in the common case
  if (text[0] !== trigger[0]) return null;

  const textBeforeCursor = text.slice(0, anchor.offset);
  if (!textBeforeCursor.startsWith(trigger)) return null;

  // The node must be the first child of its parent (no sibling nodes before it)
  const parent = node.getParent();
  if (!parent || !$isElementNode(parent)) return null;
  const firstChild = parent.getFirstChild();
  if (firstChild !== node) return null;

  return { query: textBeforeCursor.slice(trigger.length) };
}

// ─── Extension ───────────────────────────────────────────────────────────────

export const SlashCommandExtension = (
  userConfig: Partial<SlashCommandConfig> = {}
) => {
  const resolvedConfig: SlashCommandConfig = {
    trigger: "/",
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/slash-command",

    config: safeCast<SlashCommandConfig>(resolvedConfig),

    build(editor) {
      const isActive = signal(false);
      const query = signal<string | null>(null);
      const output: SlashCommandOutput = { isActive, query };
      _outputByEditor.set(editor, output);
      return output;
    },

    register(editor, _config, state) {
      const { isActive, query } = state.getOutput();
      const { trigger } = resolvedConfig;

      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const result = getSlashQuery(trigger);
          const prevQuery = query.value;
          const nextQuery = result ? result.query : null;

          if (nextQuery !== prevQuery) {
            query.value = nextQuery;
            isActive.value = nextQuery !== null;
          }
        });
      });
    },
  });

  return defineTypixExtension<SlashCommandConfig>({
    name: "slash-command",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      insertSlashCommand: (config) => (ctx, attrs) => {
        if (config.disabled) return false;
        const triggerChar =
          (attrs as { trigger?: string } | undefined)?.trigger ??
          config.trigger;
        ctx.editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) {
            sel.insertText(triggerChar);
          }
        });
        return true;
      },
    },
    shortcuts: [
      {
        key: "/",
        modifiers: ["mod"],
        command: "insertSlashCommand",
      },
    ],
  });
};
