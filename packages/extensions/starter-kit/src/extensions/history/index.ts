import {
  defineExtension,
  safeCast,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import {
  registerHistory,
  createEmptyHistoryState,
} from "@typix-editor/core/lexical/history";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface HistoryConfig {
  /** Delay in ms before consecutive edits merge into a single history entry */
  delay: number;
  disabled?: boolean;
}

export const TYPIX_UNDO = createCommand<void>("TYPIX_UNDO");
export const TYPIX_REDO = createCommand<void>("TYPIX_REDO");

export const HistoryExtension = defineExtension({
  name: "@typix/history",
  config: safeCast<HistoryConfig>({ delay: 300, disabled: false }),
  mergeConfig(a: HistoryConfig, b: Partial<HistoryConfig>): HistoryConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: HistoryConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: HistoryConfig, state: any) {
    const { disabled, delay } = state.getOutput();
    return effect(() => {
      if (disabled.value) return;
      const d0 = registerHistory(
        editor,
        createEmptyHistoryState(),
        delay.value
      );
      const d1 = editor.registerCommand(
        TYPIX_UNDO,
        () => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      const d2 = editor.registerCommand(
        TYPIX_REDO,
        () => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
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

registerTypixMeta(HistoryExtension, {
  commands: {
    undo: TYPIX_UNDO,
    redo: TYPIX_REDO,
  },
  shortcuts: [
    { key: "z", modifiers: ["mod"], command: "undo" },
    { key: "z", modifiers: ["mod", "shift"], command: "redo" },
  ],
});
