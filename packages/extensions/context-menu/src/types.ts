import type { LexicalNode } from "lexical";
import type { TypixEditor } from "@typix-editor/core";

export type TypixContextMenuItem =
  | {
    type: "item";
    label: string;
    /**
     * Icon element for the menu item.
     * The concrete type depends on the UI framework (e.g. ReactElement for React).
     */
    icon?: unknown;
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
