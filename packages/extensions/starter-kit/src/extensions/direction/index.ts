import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  defineExtension,
  safeCast,
  type LexicalEditor,
} from "lexical";
import {
  namedSignals,
  signal,
  type Signal,
} from "@typix-editor/core/lexical/extension";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

/** Text direction value. `null` removes explicit direction (browser default / auto-detect). */
export type DirectionValue = "ltr" | "rtl" | "auto" | null;

export interface DirectionConfig extends TypixExtensionConfig {
  /** Initial global direction applied to the editor root element. Default: null (browser default). */
  defaultGlobalDirection: DirectionValue;
  disabled?: boolean;
}

/** Reactive state exposed by DirectionExtension. Read via `getDirectionState(editor)`. */
export interface DirectionState {
  /** Current global direction applied to the editor root element. */
  globalDirection: Signal<DirectionValue>;
}

const _stateByEditor = new WeakMap<LexicalEditor, DirectionState>();

/** Get the reactive state for the DirectionExtension registered on this editor. */
export function getDirectionState(
  editor: LexicalEditor
): DirectionState | undefined {
  return _stateByEditor.get(editor);
}

/**
 * DirectionExtension — provides RTL/LTR text direction support.
 *
 * - **Global direction**: Sets the `dir` attribute on the editor root element,
 *   affecting all content. Supports `ltr`, `rtl`, `auto`, and `null` (browser default).
 * - **Per-node direction**: Overrides direction on individual block nodes within
 *   the current selection, enabling bidirectional content.
 *
 * @example
 * ```ts
 * // Global direction
 * editor.chain().setGlobalDirection({ direction: 'rtl' }).run()
 *
 * // Per-node direction
 * editor.chain().setLTR().run()
 * editor.chain().setRTL().run()
 * editor.chain().setAutoDirection().run()
 * editor.chain().unsetDirection().run()
 * ```
 */
export const DirectionExtension = (
  userConfig: Partial<DirectionConfig> = {}
) => {
  const resolvedConfig: DirectionConfig = {
    defaultGlobalDirection: null,
    ...userConfig,
  };

  // Shared by closure between register() and commands — no WeakMap lookup needed
  const globalDirection = signal<DirectionValue>(
    resolvedConfig.defaultGlobalDirection
  );

  const lexicalExt = defineExtension({
    name: "@typix/direction",
    config: safeCast<DirectionConfig>(resolvedConfig),
    mergeConfig(
      a: DirectionConfig,
      b: Partial<DirectionConfig>
    ): DirectionConfig {
      return { ...a, ...b };
    },
    build(editor: LexicalEditor) {
      _stateByEditor.set(editor, { globalDirection });
      return { ...namedSignals(resolvedConfig), globalDirection };
    },
    register(editor: LexicalEditor, _config: DirectionConfig, state) {
      const { disabled } = state.getOutput();

      const applyGlobalDir = () => {
        if (disabled?.value) return;
        const dir = globalDirection.value;
        const rootEl = editor.getRootElement();
        if (!rootEl) return;
        if (dir === null) {
          rootEl.removeAttribute("dir");
        } else {
          rootEl.setAttribute("dir", dir);
        }
      };

      const cleanups = [
        globalDirection.subscribe(() => applyGlobalDir()),
        editor.registerRootListener((rootEl) => {
          if (rootEl) applyGlobalDir();
        }),
      ];

      return () => cleanups.forEach((fn) => fn());
    },
  });

  return defineTypixExtension<DirectionConfig>({
    name: "direction",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      /**
       * Set the global text direction for the entire editor.
       * Applies `dir` attribute to the editor root element.
       * @param attrs.direction - 'ltr' | 'rtl' | 'auto' | null (removes attribute)
       */
      setGlobalDirection: (cfg) => (ctx, attrs) => {
        if (cfg.disabled) return false;
        const dir = (attrs?.direction ?? null) as DirectionValue;
        globalDirection.value = dir;
        // Sync Lexical root node direction (ltr/rtl only — auto/null map to null)
        ctx.editor.update(() => {
          $getRoot().setDirection(dir === "ltr" || dir === "rtl" ? dir : null);
        });
        return true;
      },

      /** Set LTR direction on all block nodes in the current selection. */
      setLTR: (cfg) => (ctx) => {
        if (cfg.disabled) return false;
        ctx.editor.update(() => $applyDirectionToSelection("ltr"));
        return true;
      },

      /** Set RTL direction on all block nodes in the current selection. */
      setRTL: (cfg) => (ctx) => {
        if (cfg.disabled) return false;
        ctx.editor.update(() => $applyDirectionToSelection("rtl"));
        return true;
      },

      /**
       * Remove explicit direction from selected block nodes.
       * Lexical will auto-detect direction from content (first strong directional char).
       */
      setAutoDirection: (cfg) => (ctx) => {
        if (cfg.disabled) return false;
        ctx.editor.update(() => $applyDirectionToSelection(null));
        return true;
      },

      /** Alias for setAutoDirection — removes explicit direction from selection. */
      unsetDirection: (cfg) => (ctx) => {
        if (cfg.disabled) return false;
        ctx.editor.update(() => $applyDirectionToSelection(null));
        return true;
      },
    },
  });
};

/** @internal Apply direction to all top-level block nodes in the current selection. */
function $applyDirectionToSelection(direction: "ltr" | "rtl" | null): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;

  const seen = new Set<string>();
  for (const node of selection.getNodes()) {
    const topLevel = node.getTopLevelElementOrThrow();
    const key = topLevel.getKey();
    if (!seen.has(key) && $isElementNode(topLevel)) {
      seen.add(key);
      topLevel.setDirection(direction);
    }
  }
}
