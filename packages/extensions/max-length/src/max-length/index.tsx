import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  type EditorState,
  type RootNode,
  RootNode as RootNodeClass,
} from "lexical";
import { useEffect } from "react";

export interface MaxLengthExtensionProps {
  maxLength: number;
}

export function MaxLengthExtension({
  maxLength,
}: MaxLengthExtensionProps): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let lastRestoredEditorState: EditorState | null = null;

    return editor.registerNodeTransform(RootNodeClass, (rootNode: RootNode) => {
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
        const delCount = textContentSize - maxLength;
        const anchor = selection.anchor;

        if (delCount > 0) {
          if (
            prevTextContentSize === maxLength &&
            lastRestoredEditorState !== prevEditorState
          ) {
            lastRestoredEditorState = prevEditorState;
            $restoreEditorState(editor, prevEditorState);
          } else {
            $trimTextContentFromAnchor(editor, anchor, delCount);
          }
        }
      }
    });
  }, [editor, maxLength]);

  return null;
}

MaxLengthExtension.displayName = "Typix.MaxLengthExtension";
