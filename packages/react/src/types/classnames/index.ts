// packages/core/src/types/classnames.ts

/**
 * Base classNames configuration for all Typix components
 */
export interface TypixBaseClassNames {
    /**
     * Root wrapper element
     * @default "{prefix}-root"
     */
    root?: string;

    /**
     * Container element
     * @default "{prefix}-container"
     */
    container?: string;

    /**
     * Content wrapper
     * @default "{prefix}-content"
     */
    content?: string;
}

/**
 * Editor-specific classNames
 */
export interface TypixEditorClassNames {
    /**
     * Scrollable wrapper
     * @default "{prefix}-scroller"
     */
    scroller?: string;

    /**
     * ContentEditable element
     * @default "{prefix}-contenteditable"
     */
    contentEditable?: string;

    /**
     * Placeholder element
     * @default "{prefix}-placeholder"
     */
    placeholder?: string;

    /**
     * Toolbar container
     * @default "{prefix}-toolbar"
     */
    toolbar?: string;

    /**
     * Toolbar item
     * @default "{prefix}-toolbar-item"
     */
    toolbarItem?: string;
}

/**
 * Menu/Dropdown classNames
 */
export interface TypixMenuClassNames {
    /**
     * Menu trigger
     * @default "{prefix}-menu-trigger"
     */
    trigger?: string;

    /**
     * Menu container
     * @default "{prefix}-menu"
     */
    menu?: string;

    /**
     * Menu list
     * @default "{prefix}-menu-list"
     */
    list?: string;

    /**
     * Menu item
     * @default "{prefix}-menu-item"
     */
    item?: string;

    /**
     * Selected menu item
     * @default "{prefix}-menu-item-selected"
     */
    itemSelected?: string;

    /**
     * Menu item icon
     * @default "{prefix}-menu-item-icon"
     */
    itemIcon?: string;

    /**
     * Menu item label
     * @default "{prefix}-menu-item-label"
     */
    itemLabel?: string;

    /**
     * Menu item description
     * @default "{prefix}-menu-item-description"
     */
    itemDescription?: string;

    /**
     * Menu separator
     * @default "{prefix}-menu-separator"
     */
    separator?: string;

    /**
     * Empty state
     * @default "{prefix}-menu-empty"
     */
    empty?: string;
}

/**
 * Complete classNames schema
 */
export interface TypixClassNames
    extends TypixBaseClassNames,
    TypixEditorClassNames,
    TypixMenuClassNames { }

/**
 * Utility type for partial classNames
 */
export type PartialClassNames<T> = {
    [K in keyof T]?: T[K] | null | undefined;
};

/**
 * Component-specific classNames creator
 */
export type ComponentClassNames<T extends Record<string, string | undefined>> =
    PartialClassNames<T>;