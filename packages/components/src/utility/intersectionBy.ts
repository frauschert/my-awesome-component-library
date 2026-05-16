import distinctBy from './distinctBy'

/**
 * Returns the intersection of two arrays based on a selector, removing duplicates from the result.
 * Only items from listA that have a matching key in listB are included.
 *
 * @template T - The type of items in the arrays
 * @template K - The type of the comparison key
 *
 * @param listA - The first array (result items come from this array)
 * @param listB - The second array (used for matching)
 * @param selector - Either a property key or a function that extracts the comparison key from each item
 *
 * @returns A new array containing unique items from listA that exist in listB based on the selector
 *
 * @example
 * // Using a property key
 * const usersA = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * const usersB = [{ id: 1, name: 'Alice Clone' }, { id: 3, name: 'Charlie' }];
 * intersectionBy(usersA, usersB, 'id');
 * // => [{ id: 1, name: 'Alice' }]
 *
 * @example
 * // Using a selector function for case-insensitive matching
 * const listA = [{ email: 'ALICE@example.com' }, { email: 'bob@example.com' }];
 * const listB = [{ email: 'alice@example.com' }, { email: 'charlie@example.com' }];
 * intersectionBy(listA, listB, u => u.email.toLowerCase());
 * // => [{ email: 'ALICE@example.com' }]
 *
 * @example
 * // With primitives
 * const numbersA = [11, 12, 21, 22];
 * const numbersB = [31, 41, 12];
 * intersectionBy(numbersA, numbersB, n => n % 10);
 * // => [11, 12]
 */
export default function intersectionBy<T, K>(
    listA: T[],
    listB: T[],
    selector: ((item: T) => K) | keyof T
): T[] {
    const getSelectorValue =
        typeof selector === 'function'
            ? selector
            : (item: T) => item[selector] as K

    const bKeys = new Set(listB.map(getSelectorValue))

    return distinctBy(listA, selector).filter((item) =>
        bKeys.has(getSelectorValue(item))
    )
}
