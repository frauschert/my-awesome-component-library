/**
 * Splits an array into smaller arrays (chunks) of a specified size.
 * The last chunk may contain fewer elements if the array length is not evenly divisible by the size.
 *
 * @template T - Type of array elements
 * @param array - The array to split into chunks
 * @param size - The size of each chunk (must be positive integer)
 * @returns An array of chunks, where each chunk is an array of elements
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2);
 * // [[1, 2], [3, 4], [5]]
 *
 * chunk(['a', 'b', 'c', 'd'], 2);
 * // [['a', 'b'], ['c', 'd']]
 *
 * chunk([1, 2, 3, 4, 5, 6], 3);
 * // [[1, 2, 3], [4, 5, 6]]
 *
 * chunk([], 2);
 * // []
 * ```
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
    if (size <= 0 || !Number.isInteger(size)) {
        throw new Error('Chunk size must be a positive integer')
    }

    if (array.length === 0) {
        return []
    }

    const result: T[][] = []

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }

    return result
}

export default chunk
