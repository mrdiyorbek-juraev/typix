import type { ReactElement } from 'react';
import {
  NodeContextMenuOption,
  NodeContextMenuPlugin,
  NodeContextMenuSeparator,
} from '@lexical/react/LexicalNodeContextMenuPlugin';
import { useMemo } from 'react';
import { useTypixEditor, type TypixEditor, type LexicalNode } from "@typix-editor/react"


export type TypixContextMenuItem =
  | {
    type: 'item';
    key: string;
    label: string;
    icon?: ReactElement;
    disabled?: boolean | ((editor: TypixEditor) => boolean);
    showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
    onSelect: (editor: TypixEditor) => void;
  }
  | {
    type: 'separator';
    key: string;
    showOn?: (node: LexicalNode, editor: TypixEditor) => boolean;
  };


type ContextMenuExtensionProps = {
  options: TypixContextMenuItem[];
};

export function ContextMenuExtension({ options }: ContextMenuExtensionProps) {
  const editor = useTypixEditor();

  const menu_options = useMemo(() => {
    return options.map((item) => {
      if (item.type === 'separator') {
        return new NodeContextMenuSeparator({
          $showOn: item.showOn
            ? (node) => item.showOn!(node, editor)
            : undefined,
        });
      }

      return new NodeContextMenuOption(item.label, {
        disabled:
          typeof item.disabled === 'function'
            ? item.disabled(editor)
            : item.disabled ?? false,
        icon: item?.icon,
        $showOn: item.showOn
          ? (node) => item.showOn!(node, editor)
          : undefined,
        $onSelect: () => item.onSelect(editor),
      });
    });
  }, [options, editor]);

  
  return (
    <NodeContextMenuPlugin
      className="TypixEditorTheme__contextMenu"
      itemClassName="TypixEditorTheme__contextMenuItem"
      separatorClassName="TypixEditorTheme__contextMenuSeparator"
      items={menu_options}
    />
  );
}

export { NodeContextMenuOption, NodeContextMenuSeparator, type ContextMenuExtensionProps };
