/**
 * Performs a deep equality comparison between two values.
 * Handles primitives, objects, arrays, dates, and RegExp.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal, false otherwise
 *
 * @example
 * // Primitives
 * deepEqual(1, 1); // => true
 * deepEqual('hello', 'hello'); // => true
 *
 * @example
 * // Objects
 * deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // => true
 * deepEqual({ a: 1 }, { a: 2 }); // => false
 *
 * @example
 * // Arrays
 * deepEqual([1, 2, 3], [1, 2, 3]); // => true
 * deepEqual([1, 2], [1, 2, 3]); // => false
 *
 * @example
 * // Nested structures
 * deepEqual(
 *   { user: { name: 'Alice', tags: ['admin'] } },
 *   { user: { name: 'Alice', tags: ['admin'] } }
 * ); // => true
 *
 * @example
 * // Dates
 * deepEqual(new Date('2025-01-01'), new Date('2025-01-01')); // => true
 */
export default function deepEqual(a: unknown, b: unknown): boolean {
    // Same reference or strict equality (handles primitives, NaN with Object.is)
    if (Object.is(a, b)) return true

    // Different types or one is null/undefined
    if (typeof a !== typeof b || a == null || b == null) return false

    // Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false
        return a.every((item, i) => deepEqual(item, b[i]))
    }

    // Dates
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
    }

    // RegExp
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString()
    }

    // Objects (plain objects, not arrays or special objects)
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)

        if (keysA.length !== keysB.length) return false

        return keysA.every(
            (key) =>
                Object.prototype.hasOwnProperty.call(b, key) &&
                deepEqual(
                    (a as Record<string, unknown>)[key],
                    (b as Record<string, unknown>)[key]
                )
        )
    }

    return false
}
