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

export type TypixContextMenuItem =
  | {
      type: "item";
      label: string;
      icon?: ReactElement;
      /**
       * Whether the item is disabled. Evaluated at render time —
       * compute this value inside the component so it stays current.
       */
      disabled?: boolean;
      /**
       * Return false to hide this item for the right-clicked node.
       */
      showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
      /**
       * Called when the item is selected.
       */
      onSelect: (editor: TypixEditor) => void;
    }
  | {
      type: "separator";
      showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
    };

export type ContextMenuExtensionProps = {
  options: TypixContextMenuItem[];
};

export function ContextMenuExtension({ options }: ContextMenuExtensionProps) {
  const editor = useTypixEditor();

  // No useMemo — options must be fresh so `disabled` reflects current state.
  const menuOptions = options.map((item) => {
    if (item.type === "separator") {
      return new NodeContextMenuSeparator({
        $showOn: item.showOn ? (node) => item.showOn!(node, editor) : undefined,
      });
    }

    return new NodeContextMenuOption(item.label, {
      disabled: item.disabled ?? false,
      icon: item.icon,
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

ContextMenuExtension.displayName = "Typix.ContextMenuExtension";
