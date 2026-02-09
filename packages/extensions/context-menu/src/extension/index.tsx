import {
  NodeContextMenuOption,
  NodeContextMenuPlugin,
  NodeContextMenuSeparator,
} from "@lexical/react/LexicalNodeContextMenuPlugin";
import {
  type LexicalNode,
  type TypixEditor,
  useTypixEditor,
} from "@typix-editor/react";
import type { ReactElement } from "react";
import { useMemo } from "react";

export type TypixContextMenuItem =
  | {
      type: "item";
      key: string;
      label: string;
      icon?: ReactElement;
      disabled?: boolean | ((editor: TypixEditor) => boolean);
      showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
      onSelect: (editor: TypixEditor) => void;
    }
  | {
      type: "separator";
      key: string;
      showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
    };

type ContextMenuExtensionProps = {
  options: TypixContextMenuItem[];
};

export function ContextMenuExtension({ options }: ContextMenuExtensionProps) {
  const editor = useTypixEditor();

  const menu_options = useMemo(
    () =>
      options.map((item) => {
        if (item.type === "separator") {
          return new NodeContextMenuSeparator({
            $showOn: item.showOn
              ? (node) => item.showOn!(node, editor)
              : undefined,
          });
        }

        return new NodeContextMenuOption(item.label, {
          disabled:
            typeof item.disabled === "function"
              ? item.disabled(editor)
              : (item.disabled ?? false),
          icon: item?.icon,
          $showOn: item.showOn
            ? (node) => item.showOn!(node, editor)
            : undefined,
          $onSelect: () => item.onSelect(editor),
        });
      }),
    [options, editor]
  );

  return (
    <NodeContextMenuPlugin
      className="typix-context-menu"
      itemClassName="typix-context-menu__item"
      items={menu_options}
      separatorClassName="typix-context-menu__separator"
    />
  );
}

ContextMenuExtension.displayName = "Typix.ContextMenuExtension";

export {
  NodeContextMenuOption,
  NodeContextMenuSeparator,
  type ContextMenuExtensionProps,
};
