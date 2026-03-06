import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import { effect, namedSignals, signal, type Signal } from "@typix-editor/core/lexical/extension";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@typix-editor/core/lexical/selection";
import {
  defineTypixExtension,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface FontSizeConfig extends TypixExtensionConfig {
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

/**
 * FontSizeExtension — applies inline font-size styles to the current selection.
 *
 * Uses `$patchStyleText` from `@lexical/selection` (Lexical best practice for
 * inline CSS on TextNodes).
 *
 * @example
 * ```ts
 * editor.chain().setFontSize({ size: 24 }).run()
 * editor.chain().increaseFontSize().run()
 * editor.chain().decreaseFontSize({ step: 2 }).run()
 * editor.chain().resetFontSize().run()
 * ```
 */
export const FontSizeExtension = (userConfig: Partial<FontSizeConfig> = {}) => {
  const resolvedConfig: FontSizeConfig = {
    defaultSize: DEFAULT_FONT_SIZE,
    minSize: MIN_FONT_SIZE,
    maxSize: MAX_FONT_SIZE,
    step: 1,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/font-size",
    config: safeCast<FontSizeConfig>(resolvedConfig),
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
      const { disabled, currentSize } = state.getOutput();

      return effect(() => {
        if (disabled?.value) return;

        return editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              currentSize.value = config.defaultSize;
              return;
            }
            const raw = $getSelectionStyleValueForProperty(
              selection,
              "font-size",
              `${config.defaultSize}px`
            );
            currentSize.value = parseFloat(raw) || config.defaultSize;
          });
        });
      });
    },
  });

  return defineTypixExtension<FontSizeConfig>({
    name: "font-size",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /** Set font size to an exact value (clamped to minSize–maxSize). */
      setFontSize: (cfg) => (ctx, attrs) => {
        if (cfg.disabled) return false;
        const size = attrs?.size as number | undefined;
        if (size == null) {
          console.warn("[Typix] setFontSize requires a { size: number } attr");
          return false;
        }
        const clamped = Math.max(cfg.minSize, Math.min(cfg.maxSize, size));
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-size": `${clamped}px` });
          }
        });
        return true;
      },

      /** Increase font size by step (or attrs.step). */
      increaseFontSize: (cfg) => (ctx, attrs) => {
        if (cfg.disabled) return false;
        const step = (attrs?.step as number | undefined) ?? cfg.step;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const current =
            parseFloat(
              $getSelectionStyleValueForProperty(
                selection,
                "font-size",
                `${cfg.defaultSize}px`
              )
            ) || cfg.defaultSize;
          const next = Math.min(cfg.maxSize, current + step);
          $patchStyleText(selection, { "font-size": `${next}px` });
        });
        return true;
      },

      /** Decrease font size by step (or attrs.step). */
      decreaseFontSize: (cfg) => (ctx, attrs) => {
        if (cfg.disabled) return false;
        const step = (attrs?.step as number | undefined) ?? cfg.step;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          const current =
            parseFloat(
              $getSelectionStyleValueForProperty(
                selection,
                "font-size",
                `${cfg.defaultSize}px`
              )
            ) || cfg.defaultSize;
          const next = Math.max(cfg.minSize, current - step);
          $patchStyleText(selection, { "font-size": `${next}px` });
        });
        return true;
      },

      /** Remove inline font-size from selection (reverts to theme / CSS default). */
      resetFontSize: (cfg) => (ctx) => {
        if (cfg.disabled) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-size": "" });
          }
        });
        return true;
      },
    },
  });
};
