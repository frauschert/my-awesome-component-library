/**
 * Splits an array into two arrays based on a predicate function.
 * Elements that satisfy the predicate go into the first array (truthy),
 * elements that don't go into the second array (falsy).
 *
 * @template T - Type of array elements
 * @param array - The array to partition
 * @param predicate - Function to test each element. Returns true to include in first array, false for second
 * @returns A tuple [pass, fail] where pass contains elements that satisfy the predicate and fail contains the rest
 *
 * @example
 * ```ts
 * partition([1, 2, 3, 4, 5], x => x % 2 === 0);
 * // [[2, 4], [1, 3, 5]]
 *
 * partition(['apple', 'banana', 'avocado', 'cherry'], s => s.startsWith('a'));
 * // [['apple', 'avocado'], ['banana', 'cherry']]
 *
 * partition([1, 2, 3, 4, 5], x => x > 10);
 * // [[], [1, 2, 3, 4, 5]]
 *
 * const users = [
 *   { name: 'Alice', active: true },
 *   { name: 'Bob', active: false },
 *   { name: 'Charlie', active: true }
 * ];
 * const [activeUsers, inactiveUsers] = partition(users, u => u.active);
 * // activeUsers: [{ name: 'Alice', active: true }, { name: 'Charlie', active: true }]
 * // inactiveUsers: [{ name: 'Bob', active: false }]
 * ```
 */
export function partition<T>(
    array: readonly T[],
    predicate: (value: T, index: number, array: readonly T[]) => boolean
): [T[], T[]] {
    const pass: T[] = []
    const fail: T[] = []

    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i], i, array)) {
            pass.push(array[i])
        } else {
            fail.push(array[i])
        }
    }

    return [pass, fail]
}

export default partition
