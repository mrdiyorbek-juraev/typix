import { effect, namedSignals } from "@lexical/extension";
import {
  $findMatchingParent,
  $insertNodeToNearestRoot,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  defineExtension,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  safeCast,
} from "lexical";

import {
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
  CollapsibleContainerNode,
} from "../nodes/container";
import {
  $createCollapsibleContentNode,
  $isCollapsibleContentNode,
  CollapsibleContentNode,
} from "../nodes/content";
import {
  $createCollapsibleTitleNode,
  $isCollapsibleTitleNode,
  CollapsibleTitleNode,
} from "../nodes/title";

export const INSERT_COLLAPSIBLE_COMMAND = createCommand<void>(
  "INSERT_COLLAPSIBLE_COMMAND"
);

export interface CollapsibleConfig {
  /** Set to true to temporarily disable collapsible behavior. */
  disabled: boolean;
}

export const CollapsibleExtension = defineExtension({
  name: "@typix/collapsible",

  nodes: () => [
    CollapsibleContainerNode,
    CollapsibleTitleNode,
    CollapsibleContentNode,
  ],

  config: safeCast<CollapsibleConfig>({ disabled: false }),

  build(_editor, config) {
    return namedSignals(config);
  },

  register(editor, _config, state) {
    const { disabled } = state.getOutput();

    return effect(() => {
      if (disabled.value) return;

      const $onEscapeUp = () => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) &&
          selection.isCollapsed() &&
          selection.anchor.offset === 0
        ) {
          const container = $findMatchingParent(
            selection.anchor.getNode(),
            $isCollapsibleContainerNode
          );
          if ($isCollapsibleContainerNode(container)) {
            const parent = container.getParent();
            if (
              parent !== null &&
              parent.getFirstChild() === container &&
              selection.anchor.key === container.getFirstDescendant()?.getKey()
            ) {
              container.insertBefore($createParagraphNode());
            }
          }
        }
        return false;
      };

      const $onEscapeDown = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const container = $findMatchingParent(
            selection.anchor.getNode(),
            $isCollapsibleContainerNode
          );
          if ($isCollapsibleContainerNode(container)) {
            const parent = container.getParent();
            if (parent !== null && parent.getLastChild() === container) {
              const titleParagraph = container.getFirstDescendant();
              const contentParagraph = container.getLastDescendant();
              if (
                (contentParagraph !== null &&
                  selection.anchor.key === contentParagraph.getKey() &&
                  selection.anchor.offset ===
                    contentParagraph.getTextContentSize()) ||
                (titleParagraph !== null &&
                  selection.anchor.key === titleParagraph.getKey() &&
                  selection.anchor.offset ===
                    titleParagraph.getTextContentSize())
              ) {
                container.insertAfter($createParagraphNode());
              }
            }
          }
        }
        return false;
      };

      return mergeRegister(
        // Structure-enforcing transforms — unwrap malformed collapsible nodes
        editor.registerNodeTransform(CollapsibleContentNode, (node) => {
          const parent = node.getParent();
          if (!$isCollapsibleContainerNode(parent)) {
            const children = node.getChildren();
            for (const child of children) {
              node.insertBefore(child);
            }
            node.remove();
          }
        }),

        editor.registerNodeTransform(CollapsibleTitleNode, (node) => {
          const parent = node.getParent();
          if (!$isCollapsibleContainerNode(parent)) {
            node.replace($createParagraphNode().append(...node.getChildren()));
          }
        }),

        editor.registerNodeTransform(CollapsibleContainerNode, (node) => {
          const children = node.getChildren();
          if (
            children.length !== 2 ||
            !$isCollapsibleTitleNode(children[0]) ||
            !$isCollapsibleContentNode(children[1])
          ) {
            for (const child of children) {
              node.insertBefore(child);
            }
            node.remove();
          }
        }),

        // Arrow-key escape: insert paragraph before/after when at document boundary
        editor.registerCommand(
          KEY_ARROW_DOWN_COMMAND,
          $onEscapeDown,
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_ARROW_RIGHT_COMMAND,
          $onEscapeDown,
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_ARROW_UP_COMMAND,
          $onEscapeUp,
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_ARROW_LEFT_COMMAND,
          $onEscapeUp,
          COMMAND_PRIORITY_LOW
        ),

        // Enter in title moves cursor into content instead of creating a new line
        editor.registerCommand(
          INSERT_PARAGRAPH_COMMAND,
          () => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const titleNode = $findMatchingParent(
                selection.anchor.getNode(),
                (node) => $isCollapsibleTitleNode(node)
              );
              if ($isCollapsibleTitleNode(titleNode)) {
                const container = titleNode.getParent();
                if (container && $isCollapsibleContainerNode(container)) {
                  if (!container.getOpen()) {
                    container.toggleOpen();
                  }
                  titleNode.getNextSibling()?.selectEnd();
                  return true;
                }
              }
            }
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),

        editor.registerCommand(
          INSERT_COLLAPSIBLE_COMMAND,
          () => {
            editor.update(() => {
              const title = $createCollapsibleTitleNode();
              const paragraph = $createParagraphNode();
              $insertNodeToNearestRoot(
                $createCollapsibleContainerNode(true).append(
                  title.append(paragraph),
                  $createCollapsibleContentNode().append(
                    $createParagraphNode()
                  )
                )
              );
              paragraph.select();
            });
            return true;
          },
          COMMAND_PRIORITY_LOW
        )
      );
    });
  },
});
