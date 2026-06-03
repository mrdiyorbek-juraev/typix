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
import { withTypixMeta } from "@typix-editor/core";

export interface FontFamilyConfig {
  /**
   * Allowlist of permitted font families. When non-empty, `setFontFamily`
   * will reject values not in this list — useful for restricting choices to
   * brand-approved fonts. Empty array (default) permits any family.
   */
  families: string[];
  disabled?: boolean;
}

/** Reactive state exposed by FontFamilyExtension. Read via `getFontFamilyState(editor)`. */
export interface FontFamilyState {
  /** Current font family of the active selection. Updates on every selection/content change. */
  currentFamily: Signal<string>;
}

const _stateByEditor = new WeakMap<LexicalEditor, FontFamilyState>();

/** Get the reactive state for the FontFamilyExtension registered on this editor. */
export function getFontFamilyState(
  editor: LexicalEditor
): FontFamilyState | undefined {
  return _stateByEditor.get(editor);
}

export const TYPIX_SET_FONT_FAMILY = createCommand<{ family: string }>(
  "TYPIX_SET_FONT_FAMILY"
);
export const TYPIX_RESET_FONT_FAMILY = createCommand<void>(
  "TYPIX_RESET_FONT_FAMILY"
);

export const FontFamilyExtension = withTypixMeta(
  defineExtension({
    name: "@typix/font-family",
    config: safeCast<FontFamilyConfig>({ families: [], disabled: false }),
    mergeConfig(
      a: FontFamilyConfig,
      b: Partial<FontFamilyConfig>
    ): FontFamilyConfig {
      return { ...a, ...b };
    },
    build(editor: LexicalEditor, config: FontFamilyConfig) {
      const signals = namedSignals(config);
      const currentFamily = signal<string>("");
      _stateByEditor.set(editor, { currentFamily });
      return { ...signals, currentFamily };
    },
    register(editor: LexicalEditor, config: FontFamilyConfig, state) {
      const { disabled, currentFamily, families } = state.getOutput();

      return effect(() => {
        if (disabled?.value) return;

        const d0 = editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              currentFamily.value = "";
              return;
            }
            currentFamily.value = $getSelectionStyleValueForProperty(
              selection,
              "font-family",
              ""
            );
          });
        });

        const d1 = editor.registerCommand(
          TYPIX_SET_FONT_FAMILY,
          ({ family }) => {
            const allowList: string[] = families?.value ?? config.families;
            if (allowList.length > 0 && !allowList.includes(family)) {
              console.warn(
                `[Typix] Font family "${family}" is not in the allowlist.`
              );
              return false;
            }
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-family": family });
              }
            });
            return true;
          },
          COMMAND_PRIORITY_EDITOR
        );

        const d2 = editor.registerCommand(
          TYPIX_RESET_FONT_FAMILY,
          () => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-family": "" });
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
        };
      });
    },
  }),
  {
    commands: () => ({
      setFontFamily: (attrs: { family: string }) => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_SET_FONT_FAMILY, attrs),
      resetFontFamily: () => (editor: LexicalEditor) =>
        editor.dispatchCommand(TYPIX_RESET_FONT_FAMILY, undefined),
    }),
  }
);

declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    setFontFamily(attrs: { family: string }): R;
    resetFontFamily(): R;
  }
}
