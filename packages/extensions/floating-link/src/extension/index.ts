import { $isAutoLinkNode, $isLinkNode } from "@typix-editor/core/lexical/link";
import {
  effect,
  namedSignals,
  signal,
  type Signal,
} from "@typix-editor/core/lexical/extension";
import {
  $findMatchingParent,
  mergeRegister,
} from "@typix-editor/core/lexical/utils";
import { $isAtNodeEnd } from "@typix-editor/core/lexical/selection";
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
import {
  defineTypixExtension,
  type TypixExtensionConfig,
} from "@typix-editor/core";

export interface FloatingLinkConfig extends TypixExtensionConfig {
  /** Set to true to temporarily disable the floating link behavior. */
  disabled: boolean;
  /**
   * When true, Ctrl/⌘+click on a link opens it in a new tab.
   * Set to false to disable the modifier-click-to-open behavior entirely.
   * @default true
   */
  openInNewTab?: boolean;
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

export const FloatingLinkExtension = (
  userConfig: Partial<FloatingLinkConfig> = {}
) => {
  const resolvedConfig: FloatingLinkConfig = {
    disabled: false,
    openInNewTab: true,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/floating-link",

    config: safeCast<FloatingLinkConfig>(resolvedConfig),

    build(editor, config) {
      const { disabled, openInNewTab } = namedSignals(config);
      const isLink = signal(false);
      const activeEditor = signal<LexicalEditor>(editor);
      const output: FloatingLinkOutput = { disabled, isLink, activeEditor };
      _outputByEditor.set(editor, output);
      return { ...output, openInNewTab };
    },

    register(editor, _config, state) {
      const { disabled, isLink, activeEditor, openInNewTab } =
        state.getOutput();

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
                  (payload.metaKey || payload.ctrlKey) &&
                  openInNewTab?.value !== false
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

  return defineTypixExtension({
    name: "floating-link",
    typix: lexicalExt,
    config: resolvedConfig,
  });
};
