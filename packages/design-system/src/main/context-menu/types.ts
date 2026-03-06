import type { ReactNode } from "react";
import type { TypixEditor } from "@typix-editor/core";

export type EditorContextMenuItem =
  | {
      type: "item";
      label: string;
      icon?: ReactNode;
      shortcut?: string;
      disabled?: boolean | ((editor: TypixEditor) => boolean);
      hidden?: boolean | ((editor: TypixEditor) => boolean);
      onSelect: (editor: TypixEditor) => void;
    }
  | {
      type: "separator";
      hidden?: boolean | ((editor: TypixEditor) => boolean);
    }
  | {
      type: "label";
      label: string;
      hidden?: boolean | ((editor: TypixEditor) => boolean);
    };

export interface EditorContextMenuProps {
  /** Menu items to render on right-click */
  items: EditorContextMenuItem[];
  /** Additional class name for the content popover */
  className?: string;
  /** The editor area to wrap — typically `<EditorContent />` */
  children: ReactNode;
}
