/**
 * Flattens a nested array structure by a specified depth.
 *
 * @param array - The array to flatten
 * @param depth - The depth level specifying how deep to flatten. Defaults to 1
 * @returns A new flattened array
 *
 * @example
 * ```ts
 * flatten([1, [2, 3], [4, [5]]]);
 * // [1, 2, 3, 4, [5]]
 *
 * flatten([1, [2, [3, [4]]]], 2);
 * // [1, 2, 3, [4]]
 *
 * flatten([1, [2, [3, [4]]]], Infinity);
 * // [1, 2, 3, 4]
 *
 * flatten([1, 2, 3]);
 * // [1, 2, 3] (no change if not nested)
 *
 * flatten([]);
 * // []
 *
 * // Common use cases
 * const nested = [[1, 2], [3, 4], [5, 6]];
 * flatten(nested);
 * // [1, 2, 3, 4, 5, 6]
 *
 * const deep = [1, [2, [3, [4, [5]]]]];
 * flatten(deep, Infinity);
 * // [1, 2, 3, 4, 5]
 * ```
 */
export function flatten<T>(array: readonly T[], depth = 1): T[] {
    if (depth < 1) {
        return Array.from(array) as T[]
    }

    return array.reduce<T[]>((acc, item) => {
        if (Array.isArray(item) && depth > 0) {
            acc.push(...(flatten(item, depth - 1) as T[]))
        } else {
            acc.push(item)
        }
        return acc
    }, [])
}

export default flatten
