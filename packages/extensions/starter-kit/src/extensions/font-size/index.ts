import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalEditor,
} from "lexical";
import {
  effect,
  namedSignals,
  signal,
  type Signal,
} from "@typix-editor/core/lexical/extension";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@typix-editor/core/lexical/selection";
import {
  registerTypixMeta,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
} from "@typix-editor/core";

export interface FontSizeConfig {
  /** Default font size in px. Used as fallback when no size is set on the selection. */
  defaultSize: number;
  /** Minimum allowed font size in px. */
  minSize: number;
  /** Maximum allowed font size in px. */
  maxSize: number;
  /** Step size for increaseFontSize / decreaseFontSize commands. */
  step: number;
  disabled?: boolean;
}

/** Reactive state exposed by FontSizeExtension. Read via `getFontSizeState(editor)`. */
export interface FontSizeState {
  /** Current font size (px) of the active selection. Updates on every selection/content change. */
  currentSize: Signal<number>;
}

const _stateByEditor = new WeakMap<LexicalEditor, FontSizeState>();

/** Get the reactive state for the FontSizeExtension registered on this editor. */
export function getFontSizeState(
  editor: LexicalEditor
): FontSizeState | undefined {
  return _stateByEditor.get(editor);
}

export const TYPIX_SET_FONT_SIZE = createCommand<{ size: number }>(
  "TYPIX_SET_FONT_SIZE"
);
export const TYPIX_INCREASE_FONT_SIZE = createCommand<{ step?: number } | void>(
  "TYPIX_INCREASE_FONT_SIZE"
);
export const TYPIX_DECREASE_FONT_SIZE = createCommand<{ step?: number } | void>(
  "TYPIX_DECREASE_FONT_SIZE"
);
export const TYPIX_RESET_FONT_SIZE = createCommand<void>(
  "TYPIX_RESET_FONT_SIZE"
);

export const FontSizeExtension = defineExtension({
  name: "@typix/font-size",
  config: safeCast<FontSizeConfig>({
    defaultSize: DEFAULT_FONT_SIZE,
    minSize: MIN_FONT_SIZE,
    maxSize: MAX_FONT_SIZE,
    step: 1,
    disabled: false,
  }),
  mergeConfig(a: FontSizeConfig, b: Partial<FontSizeConfig>): FontSizeConfig {
    return { ...a, ...b };
  },
  build(editor: LexicalEditor, config: FontSizeConfig) {
    const signals = namedSignals(config);
    const currentSize = signal<number>(config.defaultSize);
    _stateByEditor.set(editor, { currentSize });
    return { ...signals, currentSize };
  },
  register(editor: LexicalEditor, config: FontSizeConfig, state) {
    const { disabled, currentSize, defaultSize, minSize, maxSize, step } =
      state.getOutput();

    return effect(() => {
      if (disabled?.value) return;

      const d0 = editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          const defSize = defaultSize?.value ?? config.defaultSize;
          if (!$isRangeSelection(selection)) {
            currentSize.value = defSize;
            return;
          }
          const raw = $getSelectionStyleValueForProperty(
            selection,
            "font-size",
            `${defSize}px`
          );
          currentSize.value = parseFloat(raw) || defSize;
        });
      });

      const d1 = editor.registerCommand(
        TYPIX_SET_FONT_SIZE,
        ({ size }) => {
          const min = minSize?.value ?? config.minSize;
          const max = maxSize?.value ?? config.maxSize;
          const clamped = Math.max(min, Math.min(max, size));
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { "font-size": `${clamped}px` });
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d2 = editor.registerCommand(
        TYPIX_INCREASE_FONT_SIZE,
        (payload) => {
          const stepVal = payload?.step ?? step?.value ?? config.step;
          const max = maxSize?.value ?? config.maxSize;
          const defSize = defaultSize?.value ?? config.defaultSize;
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const current =
              parseFloat(
                $getSelectionStyleValueForProperty(
                  selection,
                  "font-size",
                  `${defSize}px`
                )
              ) || defSize;
            const next = Math.min(max, current + stepVal);
            $patchStyleText(selection, { "font-size": `${next}px` });
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d3 = editor.registerCommand(
        TYPIX_DECREASE_FONT_SIZE,
        (payload) => {
          const stepVal = payload?.step ?? step?.value ?? config.step;
          const min = minSize?.value ?? config.minSize;
          const defSize = defaultSize?.value ?? config.defaultSize;
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const current =
              parseFloat(
                $getSelectionStyleValueForProperty(
                  selection,
                  "font-size",
                  `${defSize}px`
                )
              ) || defSize;
            const next = Math.max(min, current - stepVal);
            $patchStyleText(selection, { "font-size": `${next}px` });
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      const d4 = editor.registerCommand(
        TYPIX_RESET_FONT_SIZE,
        () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { "font-size": "" });
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
    });
  },
});

registerTypixMeta(FontSizeExtension, {
  commands: {
    setFontSize: TYPIX_SET_FONT_SIZE,
    increaseFontSize: TYPIX_INCREASE_FONT_SIZE,
    decreaseFontSize: TYPIX_DECREASE_FONT_SIZE,
    resetFontSize: TYPIX_RESET_FONT_SIZE,
  },
});

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    setFontSize(attrs: { size: number }): R;
    increaseFontSize(attrs?: { step?: number }): R;
    decreaseFontSize(attrs?: { step?: number }): R;
    resetFontSize(): R;
  }
}
