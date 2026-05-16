/**
 * Returns true if all elements in the array satisfy the predicate.
 * Short-circuits on the first element that doesn't satisfy the predicate.
 *
 * @template T - The type of elements in the array
 * @param predicate - Function to test each element
 * @param array - The array to check
 * @returns true if all elements pass the test, false otherwise
 *
 * @example
 * all(x => x > 0, [1, 2, 3]);
 * // => true
 *
 * @example
 * all(x => x > 0, [1, -5, 3]);
 * // => false
 *
 * @example
 * all(x => x > 0, []);
 * // => true (vacuous truth)
 */
const all = <T>(predicate: (value: T) => boolean, array: T[]) =>
    array.every(predicate)

export default all
