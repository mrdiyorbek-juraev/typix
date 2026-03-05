// List extension — bullet list, ordered list, check list
import { defineExtension, safeCast, LexicalEditor } from "lexical";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  registerList,
  registerCheckList,
} from "@lexical/list";
import { $getSelection, $isRangeSelection } from "lexical";
import { $getNearestNodeOfType } from "@lexical/utils";
import { defineTypixExtension, TypixExtensionConfig } from "@typix-editor/core";
import { namedSignals, effect } from "@lexical/extension";

export interface ListConfig extends TypixExtensionConfig {
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

export const ListExtension = (userConfig: Partial<ListConfig> = {}) => {
  const resolvedConfig: ListConfig = {
    bullet: true,
    ordered: true,
    checklist: true,
    disabled: false,
    ...userConfig,
  };

  const lexicalExt = defineExtension({
    name: "@typix/list",
    config: safeCast<ListConfig>(resolvedConfig),
    mergeConfig(a: ListConfig, b: Partial<ListConfig>): ListConfig {
      return { ...a, ...b };
    },
    nodes: () => [ListNode, ListItemNode],
    build(_editor: LexicalEditor, config: ListConfig, state: any) {
      return namedSignals(config);
    },
    register(editor: LexicalEditor, _config: ListConfig, state: any) {
      const { disabled, checklist } = state.getOutput();
      return effect(() => {
        if (disabled.value) return;
        const disposers: Array<() => void> = [];
        disposers.push(registerList(editor));
        if (checklist.value) disposers.push(registerCheckList(editor));
        return () => disposers.forEach((d) => d());
      });
    },
  });

  return defineTypixExtension<ListConfig>({
    name: "list",
    typix: lexicalExt,
    config: resolvedConfig,
    commands: {
      toggleBulletList: (config) => (ctx) => {
        if (config.disabled) return false;
        if (!config.bullet) return false;
        const isActive = getActiveListType(ctx.editor) === "bullet";
        ctx.editor.dispatchCommand(
          isActive ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
          undefined
        );
        return true;
      },
      toggleOrderedList: (config) => (ctx) => {
        if (config.disabled) return false;
        if (!config.ordered) return false;
        const isActive = getActiveListType(ctx.editor) === "number";
        ctx.editor.dispatchCommand(
          isActive ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
          undefined
        );
        return true;
      },
      toggleCheckList: (config) => (ctx) => {
        if (config.disabled) return false;
        if (!config.checklist) return false;
        const isActive = getActiveListType(ctx.editor) === "check";
        ctx.editor.dispatchCommand(
          isActive ? REMOVE_LIST_COMMAND : INSERT_CHECK_LIST_COMMAND,
          undefined
        );
        return true;
      },
    },
  });
};
