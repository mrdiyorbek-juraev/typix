import type { TypixClassNames, PartialClassNames } from "../../types/classnames";
import { createPrefixGetter, DEFAULT_PREFIX } from "../prefix";

/**
 * Generates default classNames with the given prefix
 * 
 * @param prefix - The prefix to use for class names
 * @returns Complete default classNames object
 * 
 * @example
 * ```ts
 * const defaults = getDefaultClassNames("my-editor");
 * // Result: { root: "my-editor-root", menu: "my-editor-menu", ... }
 * ```
 */
function getDefaultClassNames(
    prefix: string = DEFAULT_PREFIX
): TypixClassNames {
    const getClass = createPrefixGetter(prefix);

    return {
        // Base
        root: getClass("root"),
        container: getClass("container"),
        content: getClass("content"),

        // Editor
        scroller: getClass("scroller"),
        contentEditable: getClass("contenteditable"),
        placeholder: getClass("placeholder"),
        toolbar: getClass("toolbar"),
        toolbarItem: getClass("toolbar-item"),

        // Menu
        trigger: getClass("menu-trigger"),
        menu: getClass("menu"),
        list: getClass("menu-list"),
        item: getClass("menu-item"),
        itemSelected: getClass("menu-item-selected"),
        itemIcon: getClass("menu-item-icon"),
        itemLabel: getClass("menu-item-label"),
        itemDescription: getClass("menu-item-description"),
        separator: getClass("menu-separator"),
        empty: getClass("menu-empty"),
    };
}

/**
 * Merges default classNames with user overrides
 * 
 * @param defaults - Default classNames
 * @param overrides - User-provided classNames
 * @returns Merged classNames
 */
function mergeClassNames<T extends Record<string, string | undefined>>(
    defaults: T,
    overrides?: PartialClassNames<T>
): T {
    if (!overrides) return defaults;

    const merged = { ...defaults };

    for (const key in overrides) {
        const override = overrides[key];
        if (override !== undefined && override !== null) {
            // Merge classes: default + override
            merged[key] = [defaults[key], override]
                .filter(Boolean)
                .join(" ") as T[typeof key];
        }
    }

    return merged;
}

export { getDefaultClassNames, mergeClassNames };