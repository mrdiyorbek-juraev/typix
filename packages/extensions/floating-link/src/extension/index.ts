import { $isAutoLinkNode, $isLinkNode } from "@lexical/link";
import { effect, namedSignals, signal, type Signal } from "@lexical/extension";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $isAtNodeEnd } from "@lexical/selection";
import {
  $getSelection,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
  defineExtension,
  safeCast,
  type ElementNode,
  type LexicalEditor,
  type RangeSelection,
  type TextNode,
} from "lexical";

export interface FloatingLinkConfig {
  /** Set to true to temporarily disable the floating link behavior. */
  disabled: boolean;
}

export interface FloatingLinkOutput {
  disabled: Signal<boolean>;
  /** Whether the current selection is inside a link node. */
  isLink: Signal<boolean>;
  /** The active (possibly nested) editor that owns the current selection. */
  activeEditor: Signal<LexicalEditor>;
}

const _outputByEditor = new WeakMap<LexicalEditor, FloatingLinkOutput>();

export function getFloatingLinkOutput(
  editor: LexicalEditor
): FloatingLinkOutput | undefined {
  return _outputByEditor.get(editor);
}

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }
  return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
}

export const FloatingLinkExtension = defineExtension({
  name: "@typix/floating-link",

  config: safeCast<FloatingLinkConfig>({ disabled: false }),

  build(editor, config) {
    const { disabled } = namedSignals(config);
    const isLink = signal(false);
    const activeEditor = signal<LexicalEditor>(editor);
    const output: FloatingLinkOutput = { disabled, isLink, activeEditor };
    _outputByEditor.set(editor, output);
    return output;
  },

  register(editor, _config, state) {
    const { disabled, isLink, activeEditor } = state.getOutput();

    function $updateToolbar() {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        );
        if (!(focusLinkNode || focusAutoLinkNode)) {
          isLink.value = false;
          return;
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            );
          });
        isLink.value = !badNode;
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length === 0) {
          isLink.value = false;
          return;
        }
        const node = nodes[0];
        const parent = node.getParent();
        isLink.value = $isLinkNode(parent) || $isLinkNode(node);
      }
    }

    return effect(() => {
      if (disabled.value) return;

      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            $updateToolbar();
          });
        }),

        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (_payload, newEditor) => {
            $updateToolbar();
            activeEditor.value = newEditor;
            return false;
          },
          COMMAND_PRIORITY_CRITICAL
        ),

        editor.registerCommand(
          CLICK_COMMAND,
          (payload) => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const node = getSelectedNode(selection);
              const linkNode = $findMatchingParent(node, $isLinkNode);
              if (
                $isLinkNode(linkNode) &&
                (payload.metaKey || payload.ctrlKey)
              ) {
                window.open(linkNode.getURL(), "_blank");
                return true;
              }
            }
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),

        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          () => {
            if (isLink.value) {
              isLink.value = false;
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_HIGH
        )
      );
    });
  },
});
