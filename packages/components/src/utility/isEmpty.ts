/**
 * Checks if a value is empty.
 * Works with arrays, objects, strings, Maps, Sets, null, and undefined.
 *
 * @param value - The value to check
 * @returns true if the value is empty, false otherwise
 *
 * @example
 * ```ts
 * isEmpty([]);
 * // true
 *
 * isEmpty({});
 * // true
 *
 * isEmpty('');
 * // true
 *
 * isEmpty(null);
 * // true
 *
 * isEmpty(undefined);
 * // true
 *
 * isEmpty(new Map());
 * // true
 *
 * isEmpty(new Set());
 * // true
 *
 * isEmpty([1, 2, 3]);
 * // false
 *
 * isEmpty({ a: 1 });
 * // false
 *
 * isEmpty('hello');
 * // false
 *
 * isEmpty(0);
 * // false (number zero is not considered empty)
 *
 * isEmpty(false);
 * // false (boolean false is not considered empty)
 * ```
 */
export function isEmpty(value: unknown): boolean {
    // null and undefined
    if (value == null) {
        return true
    }

    // String
    if (typeof value === 'string') {
        return value.length === 0
    }

    // Array
    if (Array.isArray(value)) {
        return value.length === 0
    }

    // Map and Set
    if (value instanceof Map || value instanceof Set) {
        return value.size === 0
    }

    // Object (check for own enumerable properties)
    // Note: Built-in objects like Date, RegExp, Promise, Error are not considered empty
    // even if they have no enumerable own properties
    if (typeof value === 'object') {
        // Built-in object types that should always return false
        if (
            value instanceof Date ||
            value instanceof RegExp ||
            value instanceof Error ||
            value instanceof Promise
        ) {
            return false
        }
        return Object.keys(value).length === 0
    }

    // Other types (numbers, booleans, functions, symbols) are not considered empty
    return false
}

export default isEmpty
