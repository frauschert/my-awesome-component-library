/**
 * Extracts the value of a specified key from each object in an array.
 * Returns a new array containing only those values.
 *
 * @template T - The type of objects in the array
 * @template K - The key to pluck from each object
 *
 * @param key - The property key to extract from each object
 * @param array - The array of objects to pluck from
 * @returns A new array containing the values of the specified key
 *
 * @example
 * // Pluck names from user objects
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 3, name: 'Charlie' }
 * ];
 * pluck('name', users);
 * // => ['Alice', 'Bob', 'Charlie']
 *
 * @example
 * // Pluck numeric values
 * const items = [
 *   { id: 1, price: 10.5 },
 *   { id: 2, price: 20.0 },
 *   { id: 3, price: 15.75 }
 * ];
 * pluck('price', items);
 * // => [10.5, 20.0, 15.75]
 *
 * @example
 * // Works with nested values
 * const data = [
 *   { user: { name: 'Alice' } },
 *   { user: { name: 'Bob' } }
 * ];
 * pluck('user', data);
 * // => [{ name: 'Alice' }, { name: 'Bob' }]
 */
export default function pluck<T, K extends keyof T>(
    key: K,
    array: T[]
): T[K][] {
    return array.map((item) => item[key])
}
