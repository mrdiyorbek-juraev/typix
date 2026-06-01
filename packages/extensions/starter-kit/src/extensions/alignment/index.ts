import {
  defineExtension,
  safeCast,
  FORMAT_ELEMENT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
  type ElementFormatType,
} from "lexical";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export type AlignmentValue =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";

export interface AlignmentConfig {
  /** Which alignments to allow. Defaults to all. */
  alignments: AlignmentValue[];
  disabled?: boolean;
}

export const TYPIX_SET_ALIGNMENT = createCommand<{ alignment: AlignmentValue }>(
  "TYPIX_SET_ALIGNMENT"
);
export const TYPIX_ALIGN_LEFT = createCommand<void>("TYPIX_ALIGN_LEFT");
export const TYPIX_ALIGN_CENTER = createCommand<void>("TYPIX_ALIGN_CENTER");
export const TYPIX_ALIGN_RIGHT = createCommand<void>("TYPIX_ALIGN_RIGHT");
export const TYPIX_ALIGN_JUSTIFY = createCommand<void>("TYPIX_ALIGN_JUSTIFY");
export const TYPIX_ALIGN_START = createCommand<void>("TYPIX_ALIGN_START");
export const TYPIX_ALIGN_END = createCommand<void>("TYPIX_ALIGN_END");

export const AlignmentExtension = defineExtension({
  name: "@typix/alignment",
  config: safeCast<AlignmentConfig>({
    alignments: ["left", "center", "right", "justify", "start", "end"],
    disabled: false,
  }),
  mergeConfig(
    a: AlignmentConfig,
    b: Partial<AlignmentConfig>
  ): AlignmentConfig {
    return { ...a, ...b };
  },
  build(_editor: LexicalEditor, config: AlignmentConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: AlignmentConfig, state: any) {
    const { disabled, alignments } = state.getOutput();
    return effect(() => {
      if (disabled?.value) return;
      const dispatch = (alignment: AlignmentValue) => {
        const enabled: AlignmentValue[] = alignments?.value ?? [
          "left",
          "center",
          "right",
          "justify",
          "start",
          "end",
        ];
        if (!enabled.includes(alignment)) {
          console.warn(`[Typix] Alignment "${alignment}" is not enabled.`);
          return false;
        }
        editor.dispatchCommand(
          FORMAT_ELEMENT_COMMAND,
          alignment as ElementFormatType
        );
        return true;
      };

      const d1 = editor.registerCommand(
        TYPIX_SET_ALIGNMENT,
        ({ alignment }) => dispatch(alignment),
        COMMAND_PRIORITY_EDITOR
      );
      const d2 = editor.registerCommand(
        TYPIX_ALIGN_LEFT,
        () => dispatch("left"),
        COMMAND_PRIORITY_EDITOR
      );
      const d3 = editor.registerCommand(
        TYPIX_ALIGN_CENTER,
        () => dispatch("center"),
        COMMAND_PRIORITY_EDITOR
      );
      const d4 = editor.registerCommand(
        TYPIX_ALIGN_RIGHT,
        () => dispatch("right"),
        COMMAND_PRIORITY_EDITOR
      );
      const d5 = editor.registerCommand(
        TYPIX_ALIGN_JUSTIFY,
        () => dispatch("justify"),
        COMMAND_PRIORITY_EDITOR
      );
      const d6 = editor.registerCommand(
        TYPIX_ALIGN_START,
        () => dispatch("start"),
        COMMAND_PRIORITY_EDITOR
      );
      const d7 = editor.registerCommand(
        TYPIX_ALIGN_END,
        () => dispatch("end"),
        COMMAND_PRIORITY_EDITOR
      );
      return () => {
        d1();
        d2();
        d3();
        d4();
        d5();
        d6();
        d7();
      };
    });
  },
});

registerTypixMeta(AlignmentExtension, {
  commands: {
    setAlignment: TYPIX_SET_ALIGNMENT,
    alignLeft: TYPIX_ALIGN_LEFT,
    alignCenter: TYPIX_ALIGN_CENTER,
    alignRight: TYPIX_ALIGN_RIGHT,
    alignJustify: TYPIX_ALIGN_JUSTIFY,
    alignStart: TYPIX_ALIGN_START,
    alignEnd: TYPIX_ALIGN_END,
  },
  shortcuts: [
    { key: "l", modifiers: ["mod", "shift"], command: "alignLeft" },
    { key: "e", modifiers: ["mod", "shift"], command: "alignCenter" },
    { key: "r", modifiers: ["mod", "shift"], command: "alignRight" },
    { key: "j", modifiers: ["mod", "shift"], command: "alignJustify" },
  ],
});


declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    setAlignment(attrs: { alignment: "left" | "center" | "right" | "justify" | "start" | "end" }): R;
    alignLeft(): R;
    alignCenter(): R;
    alignRight(): R;
    alignJustify(): R;
    alignStart(): R;
    alignEnd(): R;
  }
}
