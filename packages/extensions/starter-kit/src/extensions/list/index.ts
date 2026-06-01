// List extension — bullet list, ordered list, check list
import {
  defineExtension,
  safeCast,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalEditor,
} from "lexical";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  registerList,
  registerCheckList,
} from "@typix-editor/core/lexical/list";
import { $getNearestNodeOfType } from "@typix-editor/core/lexical/utils";
import { registerTypixMeta } from "@typix-editor/core";
import { namedSignals, effect } from "@typix-editor/core/lexical/extension";

export interface ListConfig {
  bullet: boolean;
  ordered: boolean;
  checklist: boolean;
  disabled?: boolean;
}

type ListType = "bullet" | "number" | "check" | null;

function getActiveListType(editor: any): ListType {
  let listType: ListType = null;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    const anchorNode = selection.anchor.getNode();
    const listNode = $getNearestNodeOfType(anchorNode, ListNode);
    if (listNode) listType = listNode.getListType() as ListType;
  });
  return listType;
}

export const TYPIX_TOGGLE_BULLET_LIST = createCommand<void>(
  "TYPIX_TOGGLE_BULLET_LIST"
);
export const TYPIX_TOGGLE_ORDERED_LIST = createCommand<void>(
  "TYPIX_TOGGLE_ORDERED_LIST"
);
export const TYPIX_TOGGLE_CHECK_LIST = createCommand<void>(
  "TYPIX_TOGGLE_CHECK_LIST"
);

export const ListExtension = defineExtension({
  name: "@typix/list",
  config: safeCast<ListConfig>({
    bullet: true,
    ordered: true,
    checklist: true,
    disabled: false,
  }),
  mergeConfig(a: ListConfig, b: Partial<ListConfig>): ListConfig {
    return { ...a, ...b };
  },
  nodes: () => [ListNode, ListItemNode],
  build(_editor: LexicalEditor, config: ListConfig) {
    return namedSignals(config);
  },
  register(editor: LexicalEditor, _config: ListConfig, state: any) {
    const { disabled, checklist, bullet, ordered } = state.getOutput();
    return effect(() => {
      if (disabled.value) return;
      const disposers: Array<() => void> = [];
      disposers.push(registerList(editor));
      if (checklist.value) disposers.push(registerCheckList(editor));

      if (bullet.value) {
        disposers.push(
          editor.registerCommand(
            TYPIX_TOGGLE_BULLET_LIST,
            () => {
              const isActive = getActiveListType(editor) === "bullet";
              editor.dispatchCommand(
                isActive ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
                undefined
              );
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          )
        );
      }

      if (ordered.value) {
        disposers.push(
          editor.registerCommand(
            TYPIX_TOGGLE_ORDERED_LIST,
            () => {
              const isActive = getActiveListType(editor) === "number";
              editor.dispatchCommand(
                isActive ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
                undefined
              );
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          )
        );
      }

      if (checklist.value) {
        disposers.push(
          editor.registerCommand(
            TYPIX_TOGGLE_CHECK_LIST,
            () => {
              const isActive = getActiveListType(editor) === "check";
              editor.dispatchCommand(
                isActive ? REMOVE_LIST_COMMAND : INSERT_CHECK_LIST_COMMAND,
                undefined
              );
              return true;
            },
            COMMAND_PRIORITY_EDITOR
          )
        );
      }

      return () => disposers.forEach((d) => d());
    });
  },
});

registerTypixMeta(ListExtension, {
  commands: {
    toggleBulletList: TYPIX_TOGGLE_BULLET_LIST,
    toggleOrderedList: TYPIX_TOGGLE_ORDERED_LIST,
    toggleCheckList: TYPIX_TOGGLE_CHECK_LIST,
  },
});


declare module "@typix-editor/core" {
  interface TypixCommands<R> {
    toggleBulletList(): R;
    toggleOrderedList(): R;
    toggleCheckList(): R;
  }
}
