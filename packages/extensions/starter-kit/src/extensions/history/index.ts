import {
  defineExtension,
  safeCast,
  UNDO_COMMAND,
  REDO_COMMAND,
  type LexicalEditor,
} from "lexical";
import {
  registerHistory,
  createEmptyHistoryState,
} from "@typix-editor/core/lexical/history";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface HistoryConfig extends TypixExtensionConfig {
  /** Delay in ms before consecutive edits merge into a single history entry */
  delay: number;
  disabled?: boolean;
}

/**
 * HistoryExtension — enables undo/redo via Lexical's history plugin.
 *
 * @example
 * ```ts
 * createTypix({ extensions: [HistoryExtension({ delay: 500 })] })
 *
 * editor.chain().undo().run()
 * editor.chain().redo().run()
 * ```
 */
export const HistoryExtension = (userConfig: Partial<HistoryConfig> = {}) => {
  const resolvedConfig: HistoryConfig = {
    delay: 300,
    disabled: false,
    ...userConfig,
  };
  const lexicalExt = defineExtension({
    name: "@typix/history",
    config: safeCast<HistoryConfig>(resolvedConfig),
    mergeConfig(a: HistoryConfig, b: Partial<HistoryConfig>): HistoryConfig {
      return { ...a, ...b };
    },
    build(_editor: LexicalEditor, config: HistoryConfig, state: any) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: HistoryConfig, state: any) {
      const { disabled, delay } = state.getOutput();
      return effect(() => {
        if (disabled.value) return;
        return registerHistory(editor, createEmptyHistoryState(), delay.value);
      });
    },
  });

  return defineTypixExtension<HistoryConfig>({
    name: "history",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      undo: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(UNDO_COMMAND, undefined);
        return true;
      },
      redo: (resolvedConfig) => (ctx) => {
        if (resolvedConfig.disabled) return false;
        ctx.editor.dispatchCommand(REDO_COMMAND, undefined);
        return true;
      },
    },
    shortcuts: [
      { key: "z", modifiers: ["mod"], command: "undo" },
      { key: "z", modifiers: ["mod", "shift"], command: "redo" },
    ],
  });
};
