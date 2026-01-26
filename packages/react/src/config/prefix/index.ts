import { PartialClassNames, TypixClassNames } from "../../types";

/**
 * Default prefix for Typix components
 */
export const DEFAULT_PREFIX = "typix";

/**
 * Configuration for Typix theming
 */
export interface TypixConfig {
    /**
     * Class name prefix for all components
     * @default "typix"
     * @example "my-editor" → "my-editor-menu-item"
     */
    prefix?: string;

    /**
     * Custom classNames that override defaults
     */
    classNames?: PartialClassNames<TypixClassNames>;
}

/**
 * Generates a prefixed class name
 * 
 * @param prefix - The prefix to use
 * @param name - The base class name
 * @returns Prefixed class name
 * 
 * @example
 * ```ts
 * getPrefixedClass("typix", "menu-item") // "typix-menu-item"
 * getPrefixedClass("my-app", "menu-item") // "my-app-menu-item"
 * ```
 */
export function getPrefixedClass(prefix: string, name: string): string {
    return `${prefix}-${name}`;
}

/**
 * Creates a class name getter with prefix
 * 
 * @param prefix - The prefix to use
 * @returns Function to get prefixed class names
 * 
 * @example
 * ```ts
 * const getClass = createPrefixGetter("typix");
 * getClass("menu-item") // "typix-menu-item"
 * ```
 */
export function createPrefixGetter(prefix: string = DEFAULT_PREFIX) {
    return (name: string) => getPrefixedClass(prefix, name);
}