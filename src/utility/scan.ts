/**
 * scan
 *
 * Applies a reducer over an array, returning the sequence of intermediate accumulator values.
 * Does not include the initialValue in the output; returns one value per input element.
 *
 * - Supports different accumulator and element types
 * - Passes (acc, curr, index, array) to the reducer (like Array.reduce)
 * - Accepts readonly arrays
 * - Overload without initialValue uses the first element as the seed (like Array.reduce)
 *
 * Examples
 * // With initial value
 * scan((acc, n) => acc + n, 0, [1,2,3]) // [1,3,6]
 * scan<string[], number>((acc, n) => [...acc, String(n)], [], [1,2,3]) // [["1"],["1","2"],["1","2","3"]]
 *
 * // Seedless overload (uses first element as seed, empty array => [])
 * scan((a, b) => a + b, [1,2,3]) // [1,3,6]
 * scan((a, b) => a + b, ['a','b','c']) // ['a','ab','abc']
 */
export function scan<T>(
    reducer: (acc: T, curr: T, index: number, array: readonly T[]) => T,
    array: readonly T[]
): T[]
export function scan<R, T>(
    reducer: (acc: R, curr: T, index: number, array: readonly T[]) => R,
    initialValue: R,
    array: readonly T[]
): R[]
export function scan<R, T>(
    reducer: (acc: R, curr: T, index: number, array: readonly T[]) => R,
    initialOrArray: R | readonly T[],
    maybeArray?: readonly T[]
): R[] | T[] {
    // Seedless overload: (reducer, array)
    if (maybeArray === undefined) {
        const array = initialOrArray as readonly T[]
        if (array.length === 0) return []
        const out: T[] = []
        let acc = array[0] as unknown as T
        out.push(acc)
        for (let i = 1; i < array.length; i++) {
            acc = reducer(
                acc as unknown as R,
                array[i],
                i,
                array
            ) as unknown as T
            out.push(acc)
        }
        return out
    } else {
        // Explicit initial value provided: (reducer, initialValue, array)
        const initialValue = initialOrArray as R
        const array = maybeArray as readonly T[]
        const out: R[] = []
        let acc = initialValue
        for (let i = 0; i < array.length; i++) {
            acc = reducer(acc, array[i], i, array)
            out.push(acc)
        }
        return out
    }
}

/**
 * scanIter
 *
 * Lazy version of scan. Yields each intermediate accumulator value.
 */
export function* scanIter<R, T>(
    iterable: Iterable<T>,
    reducer: (acc: R, curr: T) => R,
    initialValue: R
): IterableIterator<R> {
    let acc = initialValue
    for (const item of iterable) {
        acc = reducer(acc, item)
        yield acc
    }
}

export default scan
