import {
  NodeContextMenuOption,
  NodeContextMenuPlugin,
  NodeContextMenuSeparator,
} from "@lexical/react/LexicalNodeContextMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useMemo, type ReactElement } from "react";
import { TypixEditor } from "@typix-editor/core";
import type { TypixContextMenuItem } from "@typix-editor/extension-context-menu";

export type ContextMenuUIProps = {
  options: TypixContextMenuItem[];
};

export function ContextMenuUI({ options }: ContextMenuUIProps) {
  const [lexicalEditor] = useLexicalComposerContext();
  const editor = useMemo(() => new TypixEditor(lexicalEditor), [lexicalEditor]);

  // No useMemo — options must be fresh so `disabled` reflects current state.
  const menuOptions = options.map((item) => {
    if (item.type === "separator") {
      return new NodeContextMenuSeparator({
        $showOn: item.showOn ? (node) => item.showOn!(node, editor) : undefined,
      });
    }

    return new NodeContextMenuOption(item.label, {
      disabled: item.disabled ?? false,
      icon: item.icon as ReactElement | undefined,
      $showOn: item.showOn ? (node) => item.showOn!(node, editor) : undefined,
      $onSelect: () => item.onSelect(editor),
    });
  });

  return (
    <NodeContextMenuPlugin
      className="typix-context-menu"
      itemClassName="typix-context-menu__item"
      items={menuOptions}
      separatorClassName="typix-context-menu__separator"
    />
  );
}

ContextMenuUI.displayName = "Typix.ContextMenuUI";
