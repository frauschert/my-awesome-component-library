/**
 * Returns true if no elements in the array satisfy the predicate.
 *
 * @template T - The type of elements in the array
 * @param predicate - Function to test each element
 * @param array - The array to check
 * @returns true if no elements pass the test, false otherwise
 *
 * @example
 * none(x => x > 5, [1, 2, 3]);
 * // => true
 *
 * @example
 * none(x => x > 5, [1, 6, 3]);
 * // => false
 *
 * @example
 * none(x => x > 5, []);
 * // => true (vacuous truth)
 */
const none = <T>(predicate: (value: T) => boolean, array: T[]) =>
    !array.some(predicate)

export default none
