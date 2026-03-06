import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  safeCast,
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
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface FontFamilyConfig extends TypixExtensionConfig {
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

/**
 * FontFamilyExtension — applies an inline font-family style to the current
 * selection.
 *
 * Uses `$patchStyleText` from `@lexical/selection` (Lexical best practice for
 * inline CSS on TextNodes).
 *
 * @example
 * ```ts
 * editor.chain().setFontFamily({ family: 'Georgia' }).run()
 * editor.chain().resetFontFamily().run()
 *
 * // Restrict to approved fonts
 * FontFamilyExtension({ families: ['Inter', 'Georgia', 'monospace'] })
 * ```
 */
export const FontFamilyExtension = (
  userConfig: Partial<FontFamilyConfig> = {}
) => {
  const resolvedConfig: FontFamilyConfig = {
    families: [],
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/font-family",
    config: safeCast<FontFamilyConfig>(resolvedConfig),
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
    register(editor: LexicalEditor, _config: FontFamilyConfig, state) {
      const { disabled, currentFamily } = state.getOutput();

      return effect(() => {
        if (disabled?.value) return;

        return editor.registerUpdateListener(({ editorState }) => {
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
      });
    },
  });

  return defineTypixExtension<FontFamilyConfig>({
    name: "font-family",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /** Set the font family on the current selection. */
      setFontFamily: (cfg) => (ctx, attrs) => {
        if (cfg.disabled) return false;
        const family = attrs?.family as string | undefined;
        if (!family) {
          console.warn(
            "[Typix] setFontFamily requires a { family: string } attr"
          );
          return false;
        }
        if (cfg.families.length > 0 && !cfg.families.includes(family)) {
          console.warn(
            `[Typix] Font family "${family}" is not in the allowlist.`
          );
          return false;
        }
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-family": family });
          }
        });
        return true;
      },

      /** Remove the inline font-family from selection (reverts to theme / CSS default). */
      resetFontFamily: (cfg) => (ctx) => {
        if (cfg.disabled) return false;
        ctx.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-family": "" });
          }
        });
        return true;
      },
    },
  });
};
