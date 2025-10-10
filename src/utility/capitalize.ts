/**
 * Capitalizes the first character of a string.
 *
 * @template T - The string literal type
 * @param value - The string to capitalize
 * @returns The string with its first character uppercased
 *
 * @example
 * capitalize('hello');
 * // => 'Hello'
 *
 * @example
 * capitalize('WORLD');
 * // => 'WORLD'
 *
 * @example
 * capitalize('a');
 * // => 'A'
 *
 * @example
 * // Type-level capitalization
 * const result: 'Hello' = capitalize('hello');
 */
const capitalize = <T extends string>(value: T): Capitalize<T> =>
    (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>

export default capitalize
export { capitalize }
