
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * Handles conditional classes and Tailwind deduplication
 * 
 * @param inputs - Class names to merge
 * @returns Merged class string
 * 
 * @example
 * ```ts
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-2")
 * // Result: "py-2 px-2 bg-blue-500" (px-4 overridden by px-2)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Creates a class getter function with optional theme integration
 * 
 * @param baseClasses - Base class names
 * @param userClasses - User override classes
 * @returns Function to get merged classes
 * 
 * @example
 * ```tsx
 * const getClasses = createClassGetter(
 *   { item: "px-2 py-1", icon: "w-4 h-4" },
 *   { item: "px-4" }
 * );
 * 
 * <div className={getClasses("item")} />  // "py-1 px-4"
 * <span className={getClasses("icon")} /> // "w-4 h-4"
 * ```
 */
export function createClassGetter<T extends Record<string, string | undefined>>(
    baseClasses: T,
    userClasses?: Partial<T>
) {
    return (key: keyof T): string => {
        const base = baseClasses[key];
        const user = userClasses?.[key];
        return cn(base, user);
    };
}

/**
 * Extracts specific classes from a classNames object
 * 
 * @param classNames - Full classNames object
 * @param keys - Keys to extract
 * @returns Extracted classNames
 * 
 * @example
 * ```ts
 * const all = { root: "p-4", item: "px-2", icon: "w-4" };
 * const extracted = extractClassNames(all, ["item", "icon"]);
 * // Result: { item: "px-2", icon: "w-4" }
 * ```
 */
export function extractClassNames<T extends Record<string, string | undefined>,
    K extends keyof T
>(classNames: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
        if (classNames[key] !== undefined) {
            result[key] = classNames[key];
        }
    }

    return result;
}