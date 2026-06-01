import { signal } from "@typix-editor/core/lexical/extension";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $isElementNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import { registerTypixMeta, registerExtensionOutput } from "@typix-editor/core";
import type { SlashCommandConfig, SlashCommandOutput } from "../types";

// ─── Commands ────────────────────────────────────────────────────────────────

export const TYPIX_INSERT_SLASH_COMMAND = createCommand<{
  trigger?: string;
} | void>("TYPIX_INSERT_SLASH_COMMAND");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSlashQuery(trigger: string): { query: string } | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;

  const anchor = selection.anchor;
  if (anchor.type !== "text") return null;

  if (anchor.offset < trigger.length) return null;

  const node = anchor.getNode();
  if (!$isTextNode(node)) return null;

  const text = node.getTextContent();
  if (text[0] !== trigger[0]) return null;

  const textBeforeCursor = text.slice(0, anchor.offset);
  if (!textBeforeCursor.startsWith(trigger)) return null;

  const parent = node.getParent();
  if (!parent || !$isElementNode(parent)) return null;
  const firstChild = parent.getFirstChild();
  if (firstChild !== node) return null;

  return { query: textBeforeCursor.slice(trigger.length) };
}

// ─── Extension ───────────────────────────────────────────────────────────────

export const SlashCommandExtension = defineExtension({
  name: "@typix/slash-command",

  config: safeCast<SlashCommandConfig>({
    trigger: "/",
    disabled: false,
  }),

  mergeConfig(
    a: SlashCommandConfig,
    b: Partial<SlashCommandConfig>
  ): SlashCommandConfig {
    return { ...a, ...b };
  },

  build(editor: LexicalEditor) {
    const isActive = signal(false);
    const query = signal<string | null>(null);
    const output: SlashCommandOutput = { isActive, query };
    registerExtensionOutput(editor, SlashCommandExtension, output);
    return output;
  },

  register(editor: LexicalEditor, _config: SlashCommandConfig, state: any) {
    const { isActive, query } = state.getOutput();
    const { trigger } = _config;

    const d0 = editor.registerUpdateListener(({ editorState }) => {
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

    const d1 = editor.registerCommand(
      TYPIX_INSERT_SLASH_COMMAND,
      (payload) => {
        if (_config.disabled) return false;
        const triggerChar = payload?.trigger ?? _config.trigger;
        editor.update(() => {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) {
            sel.insertText(triggerChar);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      d0();
      d1();
    };
  },
});

registerTypixMeta(SlashCommandExtension, {
  commands: {
    insertSlashCommand: TYPIX_INSERT_SLASH_COMMAND,
  },
  shortcuts: [
    {
      key: "/",
      modifiers: ["mod"],
      command: "insertSlashCommand",
    },
  ],
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    insertSlashCommand(attrs?: { trigger?: string }): R;
  }
}
