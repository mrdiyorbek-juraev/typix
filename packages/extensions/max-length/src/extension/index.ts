import { effect, namedSignals } from "@typix-editor/core/lexical/extension";
import { $trimTextContentFromAnchor } from "@typix-editor/core/lexical/selection";
import { $restoreEditorState } from "@typix-editor/core/lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  type EditorState,
  type RootNode,
  RootNode as RootNodeClass,
  safeCast,
} from "lexical";
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface MaxLengthConfig extends TypixExtensionConfig {
  /** Maximum number of characters allowed. Adjustable at runtime via signals. */
  maxLength: number;
  /** Set to true to temporarily disable the limit without removing the extension. */
  disabled: boolean;
  /**
   * - `"hard"` (default): prevent typing past the limit by restoring/trimming content.
   * - `"soft"`: allow typing past the limit but fire `onExceed` so the UI can warn.
   */
  mode?: "hard" | "soft";
  /**
   * Called whenever the content exceeds (or returns to within) the limit.
   * `current` is the actual character count; `max` is the configured limit.
   * Called on every update, not just the first exceed.
   */
  onExceed?: (current: number, max: number) => void;
}

export const MaxLengthExtension = (
  userConfig: Partial<MaxLengthConfig> = {}
) => {
  const resolvedConfig: MaxLengthConfig = {
    maxLength: 500,
    disabled: false,
    mode: "hard",
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/max-length",

    config: safeCast<MaxLengthConfig>(resolvedConfig),

    build(_editor, config) {
      return namedSignals(config);
    },

    register(editor, _config, state) {
      const { disabled, maxLength, mode } = state.getOutput();

      return effect(() => {
        if (disabled.value) return;

        const limit = maxLength.value;
        const isSoft = mode?.value === "soft";
        let lastRestoredEditorState: EditorState | null = null;

        return editor.registerNodeTransform(
          RootNodeClass,
          (rootNode: RootNode) => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
              return;
            }

            const prevEditorState = editor.getEditorState();
            const prevTextContentSize = prevEditorState.read(() =>
              rootNode.getTextContentSize()
            );
            const textContentSize = rootNode.getTextContentSize();

            if (prevTextContentSize !== textContentSize) {
              const delCount = textContentSize - limit;
              const anchor = selection.anchor;

              if (delCount > 0) {
                resolvedConfig.onExceed?.(textContentSize, limit);

                if (!isSoft) {
                  if (
                    prevTextContentSize === limit &&
                    lastRestoredEditorState !== prevEditorState
                  ) {
                    lastRestoredEditorState = prevEditorState;
                    $restoreEditorState(editor, prevEditorState);
                  } else {
                    $trimTextContentFromAnchor(editor, anchor, delCount);
                  }
                }
              }
            }
          }
        );
      });
    },
  });

  return defineTypixExtension({
    name: "max-length",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
