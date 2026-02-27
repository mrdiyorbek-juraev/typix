import { effect, namedSignals } from "@lexical/extension";
import { $trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  defineExtension,
  type EditorState,
  type RootNode,
  RootNode as RootNodeClass,
  safeCast,
} from "lexical";

export interface MaxLengthConfig {
  /** Maximum number of characters allowed. Adjustable at runtime via signals. */
  maxLength: number;
  /** Set to true to temporarily disable the limit without removing the extension. */
  disabled: boolean;
}

export const MaxLengthExtension = defineExtension({
  name: "@typix/max-length",

  config: safeCast<MaxLengthConfig>({ maxLength: 500, disabled: false }),

  build(_editor, config ) {
    return namedSignals(config);
  },

  register(editor, _config, state) {
    const { disabled, maxLength } = state.getOutput();

    return effect(() => {
      if (disabled.value) return;

      const limit = maxLength.value;
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
      );
    });
  },
});
