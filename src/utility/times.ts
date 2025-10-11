/**
 * Executes a function n times and returns an array of the results.
 * The function receives the current iteration index (0-based) as an argument.
 *
 * @param n - The number of times to execute the function
 * @param fn - The function to execute. Receives the current index (0 to n-1)
 * @returns An array containing the results of each function execution
 *
 * @example
 * ```ts
 * times(5, (i) => i * 2);
 * // [0, 2, 4, 6, 8]
 *
 * times(3, (i) => `item-${i}`);
 * // ['item-0', 'item-1', 'item-2']
 *
 * times(4, () => Math.random());
 * // [0.123, 0.456, 0.789, 0.012] (random values)
 *
 * times(0, (i) => i);
 * // []
 *
 * // Generate array of objects
 * times(3, (i) => ({ id: i, name: `User ${i}` }));
 * // [{ id: 0, name: 'User 0' }, { id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]
 *
 * // Create test data
 * times(5, (i) => ({
 *     id: i + 1,
 *     title: `Post ${i + 1}`,
 *     published: true
 * }));
 *
 * // Generate repeated elements
 * times(10, () => 'x').join('');
 * // 'xxxxxxxxxx'
 * ```
 */
export function times<T>(n: number, fn: (index: number) => T): T[] {
    if (n < 0) {
        throw new Error('times: n must be non-negative')
    }

    if (!Number.isInteger(n)) {
        throw new Error('times: n must be an integer')
    }

    const result: T[] = []
    for (let i = 0; i < n; i++) {
        result.push(fn(i))
    }
    return result
}

export default times
