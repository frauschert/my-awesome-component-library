/**
 * Returns a new array with duplicate items removed, using a selector to determine uniqueness.
 * Preserves the first occurrence of each unique value.
 *
 * @template T - The type of items in the array
 * @template K - The type of the uniqueness key
 *
 * @param list - The array to filter for unique items
 * @param selector - Either a property key or a function that extracts the uniqueness key from each item
 *
 * @returns A new array containing only unique items based on the selector
 *
 * @example
 * // Using a property key
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice Clone' }
 * ];
 * distinctBy(users, 'id');
 * // => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * @example
 * // Using a selector function
 * const emails = [
 *   { id: 1, email: 'ALICE@example.com' },
 *   { id: 2, email: 'alice@example.com' }
 * ];
 * distinctBy(emails, u => u.email.toLowerCase());
 * // => [{ id: 1, email: 'ALICE@example.com' }]
 *
 * @example
 * // With primitives
 * const numbers = [11, 12, 21, 22, 31];
 * distinctBy(numbers, n => n % 10);
 * // => [11, 12]
 */
export default function distinctBy<T, K>(
    list: T[],
    selector: ((item: T) => K) | keyof T
): T[] {
    const seen = new Set<K>()
    const result: T[] = []

    const getSelectorValue =
        typeof selector === 'function'
            ? (selector as (item: T) => K)
            : (item: T) => (item as any)[selector] as K

    for (const item of list) {
        const key = getSelectorValue(item)
        if (!seen.has(key)) {
            seen.add(key)
            result.push(item)
        }
    }

    return result
}
